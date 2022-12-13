use actix_web::{get, web, App, HttpServer, Responder, post, delete, put, HttpResponse};
use diesel::PgConnection;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use crate::db::DbPool;
use crate::models;

#[get("/api/profile")]
pub async fn all_profile(pool: web::Data<DbPool>, apt_pool: web::Data<DbPool>,address: web::Path<String>) -> impl Responder {

    let conn:PooledConnection<ConnectionManager<PgConnection>> = pool.get().expect("couldn't get db connection from pool");
    let nfts = models::token_ownerships::query_nfts_by_owner(conn,address.to_string()).map_err(
        |e| {
                     eprintln!("{}", e);
                     HttpResponse::InternalServerError().finish()
        }
    )?;


    Ok(HttpResponse::Ok().json(nfts))
}

#[post("/api/profile")]
pub async fn new_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}

#[put("/api/profile")]
pub async fn update_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}
