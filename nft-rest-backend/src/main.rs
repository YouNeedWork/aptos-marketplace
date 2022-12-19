use actix_web::{get, web, App, HttpServer, Responder};
use anyhow::Result;
use dotenvy::dotenv;
use std::env;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate diesel;


use nft_rest_backend::{api, AppState};
use nft_rest_backend::db;
use nft_rest_backend::models;
use nft_rest_backend::schema;

#[cfg(unix)]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;


#[actix_web::main]
async fn main() -> Result<()> {
    dotenv().ok();
    tracing_log_init();

    let url = env::var(&"CARGOS")?;
    let pool = db::get_connection_pool(&url);
    let url = env::var(&"APT")?;
    let apt_pool = db::get_connection_pool(&url);
    let port = env::var(&"PORT")?.parse::<i16>().unwrap_or(8080);

    let app_state = AppState {
        market_db: pool,
        index_db: apt_pool,
    };



    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .service(web::scope("/api").service(api::profile::all_profile))
    })
    .bind(("127.0.0.1", 9090))?
    .run()
    .await?;

    Ok(())
}

fn tracing_log_init() {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::TRACE)
        .finish();

    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");
}
