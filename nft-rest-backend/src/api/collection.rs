use crate::models::current_collection_datas::query_info_by_collection_hash;
use crate::models::current_token_datas::{query_nfts_by_collection, CurrentTokenData};
use crate::AppState;
use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::PgConnection;

use tracing::{debug};

#[get("collection/{hash}")]
pub async fn all_collection(
    (hash, state): (web::Path<String>, web::Data<AppState>),
) -> impl Responder {
    let conn: PooledConnection<ConnectionManager<PgConnection>> = state
        .index_db
        .get()
        .expect("couldn't get db connection from pool");

    //select * from table_items where table_handle = '0xaeef8b346d7241bdc8db8b0ccc474b071e3b86f53e7dde459f154d1ea0554258' and is_deleted = 'f';

    let nft_info = match query_info_by_collection_hash(conn, &hash) {
        Ok(nft_info) => nft_info,
        Err(e) => {
            debug!(err = e.to_string(), "error");
            return HttpResponse::InternalServerError().finish();
        }
    };

    let conn: PooledConnection<ConnectionManager<PgConnection>> = state
        .index_db
        .get()
        .expect("couldn't get db connection from pool");

    let nfts: Vec<CurrentTokenData> = match query_nfts_by_collection(
        conn,
        &nft_info.creator_address,
        &nft_info.collection_name,
    ) {
        Ok(nfts) => nfts,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    // let results = nfts.iter().map(|(token_data,token_onwner)|{
    //     let metadata_uri = token_data.metadata_uri.clone();
    //
    //     //req::get(&metadata_uri).send().await.unwrap().json::<serde_json::Value>().await.unwrap();
    //     //let image_url = metadata_uri.replace("ipfs://","https://ipfs.io/ipfs/");
    //
    //     let nft = Nft{
    //         creator_address: token_data.creator_address.clone(),
    //         collection_name: token_data.collection_name.clone(),
    //         name: token_data.name.clone(),
    //         owner_address: token_onwner.owner_address.clone(),
    //         image_url: token_data.metadata_uri.clone(),
    //         token_data_id_hash: token_data.token_data_id_hash.clone(),
    //     };
    //
    //     nft
    // }).collect::<Vec<Nft>>();

    HttpResponse::Ok().json(nfts)
}

#[post("/api/collection")]
pub async fn post_new_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[delete("/api/collection")]
pub async fn delete_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[put("/api/collection")]
pub async fn update_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}
