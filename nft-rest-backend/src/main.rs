use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{rt, web, App, HttpServer};
use anyhow::Result;
use dotenvy::dotenv;

extern crate redis;

use std::{env, io};

extern crate diesel;
extern crate diesel_migrations;

use nft_rest_backend::db;

use nft_rest_backend::service;
use nft_rest_backend::{api, AppState};

#[cfg(unix)]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[actix_web::main]
async fn main() -> Result<()> {
    dotenv().ok();
    tracing_log_init(1, "api.log", "./");

    let url = env::var("CARGOS")?;
    let pool = db::get_connection_pool(&url);
    let url = env::var("APT")?;
    let apt_pool = db::get_connection_pool(&url);

    // let redis_client = my_redis::MemStore::new();
    // let rds = redis_client.clone();
    // let mut con = rds.redis.get_connection()?;

    let client = redis::Client::open("redis://127.0.0.1/")?;
    let rdx = client.clone();
    let apt = apt_pool.clone();
    //move _redis table_items to nftmarket collection

    let _fetch_market = rt::spawn(async move { service::fetch_nfts_on_market(rdx, apt).await });

    let app_state = AppState {
        market_db: pool,
        index_db: apt_pool,
        redis_db: client,
    };

    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .supports_credentials(),
            )
            .wrap(Logger::default())
            .app_data(web::Data::new(app_state.clone()))
            .service(
                web::scope("/api")
                    .service(api::profile::all_profile)
                    .service(api::collection::all_collection),
            )
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await?;

    Ok(())
}

fn tracing_log_init(verbosity: u8, filename: &str, filepath: &str) {
    use crossterm::tty::IsTty;
    use tracing_subscriber::{
        fmt::{format::Writer, time::FormatTime},
        EnvFilter,
    };

    match verbosity {
        0 => std::env::set_var("RUST_LOG", "info"),
        1 => std::env::set_var("RUST_LOG", "debug"),
        2 | 3 => std::env::set_var("RUST_LOG", "trace"),
        _ => std::env::set_var("RUST_LOG", "info"),
    };

    struct LocalTimer;
    impl FormatTime for LocalTimer {
        fn format_time(&self, w: &mut Writer<'_>) -> std::fmt::Result {
            write!(w, "{}", chrono::Local::now().format("%Y-%m-%d %H:%M:%S"))
        }
    }

    if !filepath.is_empty() && !std::io::stdout().is_tty() && std::fs::metadata(filepath).is_err()
    {
        std::fs::create_dir(filepath).unwrap();
    }

    let file_appender = tracing_appender::rolling::hourly(filepath, filename);

    let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);

    let format = tracing_subscriber::fmt::format()
        .with_target(false)
        .with_level(verbosity == 3 || verbosity == 1)
        .with_line_number(verbosity == 3 || verbosity == 1)
        .with_source_location(verbosity == 3 || verbosity == 1)
        .with_timer(LocalTimer);

    // Filter out undesirable logs.
    let filter = EnvFilter::from_default_env()
        .add_directive("mio=off".parse().unwrap())
        .add_directive("tokio_util=off".parse().unwrap())
        .add_directive("hyper::proto::h1::conn=off".parse().unwrap())
        .add_directive("hyper::proto::h1::decode=off".parse().unwrap())
        .add_directive("hyper::proto::h1::io=off".parse().unwrap())
        .add_directive("hyper::proto::h1::role=off".parse().unwrap())
        .add_directive("jsonrpsee=off".parse().unwrap());

    if io::stdout().is_tty() {
        tracing_subscriber::fmt()
            .with_env_filter(filter)
            .with_writer(io::stdout) // 写入标准输出
            .with_ansi(true) // 如果日志是写入文件，应将ansi的颜色输出功能关掉
            .event_format(format)
            .init();
    } else {
        tracing_subscriber::fmt()
            .with_env_filter(filter)
            .with_writer(non_blocking) // 写入文件，将覆盖上面的标准输出
            .with_ansi(false) // 如果日志是写入文件，应将ansi的颜色输出功能关掉
            .event_format(format)
            .init();
    }

    //tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");
}
