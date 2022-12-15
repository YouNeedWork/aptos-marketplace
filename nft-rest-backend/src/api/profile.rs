use crate::db::DbPool;
use crate::models;
use actix_web::{delete, get, post, put, web, App, HttpResponse, HttpServer, Responder};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::PgConnection;
use tracing::{info, trace};
use crate::models::query_posts;

#[get("/api/profile")]
pub async fn all_profile(
    pool: web::Data<DbPool>,
    wallet: web::Path<String>
 ) -> impl Responder {
    let conn: PooledConnection<ConnectionManager<PgConnection>> =
        pool.get().expect("couldn't get db connection from pool");

    info!("wallet: {}",wallet);

    let nfts = query_posts(conn).map_err(
        |e| {
            trace!("Error querying posts: {}", e);
            HttpResponse::InternalServerError().finish()
        },
    ).unwrap();


    HttpResponse::Ok().json(nfts)
}

#[post("/api/profile")]
pub async fn new_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}

#[put("/api/profile")]
pub async fn update_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}
