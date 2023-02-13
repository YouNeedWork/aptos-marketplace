use crate::AppState;
use actix_web::{get, post, put, web, HttpResponse, Responder};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::PgConnection;
use serde::{Deserialize, Serialize};
use tracing::info;

use crate::models::current_token_datas::{query_nfts_by_owner, CurrentTokenData};
use crate::models::current_token_ownerships::CurrentTokenOwnership;

#[derive(Debug, Deserialize, Serialize)]
struct Nft {
    pub creator_address: String,
    pub collection_name: String,
    pub name: String,
    pub owner_address: String,
    pub image_url: String,
    pub token_data_id_hash: String,
}

#[get("profile/{wallet}")]
pub async fn all_profile(
    (wallet, state): (web::Path<String>, web::Data<AppState>),
) -> impl Responder {
    let conn: PooledConnection<ConnectionManager<PgConnection>> = state
        .index_db
        .get()
        .expect("couldn't get db connection from pool");

    info!("wallet: {}", wallet);

    let nfts: Vec<(CurrentTokenData, CurrentTokenOwnership)> =
        match query_nfts_by_owner(conn, &wallet) {
            Ok(nfts) => nfts,
            Err(_) => return HttpResponse::InternalServerError().finish(),
        };

    let results = nfts
        .iter()
        .map(|(token_data, token_onwner)| {
            let _metadata_uri = token_data.metadata_uri.clone();

            //req::get(&metadata_uri).send().await.unwrap().json::<serde_json::Value>().await.unwrap();
            //let image_url = metadata_uri.replace("ipfs://","https://ipfs.io/ipfs/");

            Nft {
                creator_address: token_data.creator_address.clone(),
                collection_name: token_data.collection_name.clone(),
                name: token_data.name.clone(),
                owner_address: token_onwner.owner_address.clone(),
                image_url: token_data.metadata_uri.clone(),
                token_data_id_hash: token_data.token_data_id_hash.clone(),
            }
        })
        .collect::<Vec<Nft>>();

    HttpResponse::Ok().json(results)
}

#[post("profile")]
pub async fn new_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}

#[put("profile")]
pub async fn update_profile(address: web::Path<String>) -> impl Responder {
    format!("Hello {address}!")
}
