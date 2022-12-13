use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;
use actix_web::{get, web, App, HttpServer, Responder};

mod api;

#[cfg(unix)]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    tracing_log_init();

    HttpServer::new(|| {
        App::new()
            .service(api::collection::all_collection)
            .app_data(web::JsonConfig::default().limit(4096))
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
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