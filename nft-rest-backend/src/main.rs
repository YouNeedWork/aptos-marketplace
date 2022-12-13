use std::env;
use anyhow::Result;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;
use actix_web::{get, web, App, HttpServer, Responder};
use dotenvy::dotenv;
use crate::db::get_connection_pool;

#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate diesel;


mod api;
mod db;
mod models;
mod schema;

#[cfg(unix)]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;


#[actix_web::main]
async fn main() -> Result<()> {
    dotenv().ok();
    tracing_log_init();

    let url = env::var(&"CARGOS")?;
    let pool = get_connection_pool(&url);
    let url = env::var(&"APT")?;
    let apt_pool = get_connection_pool(&url);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(apt_pool.clone()))
            .service(api::collection::all_collection)
            .app_data(web::JsonConfig::default().limit(4096))
    })
        .bind(("0.0.0.0", 8080))?
        .run()
        .await?;

    Ok(())
}


fn tracing_log_init(){
    let subscriber = FmtSubscriber::builder()
        // all spans/events with a level higher than TRACE (e.g, debug, info, warn, etc.)
        // will be written to stdout.
        .with_max_level(Level::INFO)
        // completes the builder.
        .finish();

    tracing::subscriber::set_global_default(subscriber)
        .expect("setting default subscriber failed");
}