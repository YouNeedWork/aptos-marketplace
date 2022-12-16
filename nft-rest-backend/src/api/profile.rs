use crate::db::DbPool;
use crate::{AppState, models};
use actix_web::{delete, get, post, put, web, App, HttpResponse, HttpServer, Responder};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::PgConnection;
use tracing::{info, trace};
use crate::models::{query_nfts_by_owner, query_posts};


#[get("profile/{wallet}")]
pub async fn all_profile(
    (wallet,state): (web::Path<String>,web::Data<AppState>)
 ) -> impl Responder {
    let conn: PooledConnection<ConnectionManager<PgConnection>> =
        state.index_db.get().expect("couldn't get db connection from pool");

    info!("wallet: {}",wallet);

    let nfts = match query_nfts_by_owner(conn,&wallet) {
        Ok(nfts) => nfts,
        Err(_) =>  return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(nfts)
}

#[post("profile")]
pub async fn new_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}

#[put("profile")]
pub async fn update_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}
