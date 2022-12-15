use anyhow::Result;
use bigdecimal::BigDecimal;
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use field_count::FieldCount;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::info;

use crate::schema;
use schema::*;

#[derive(Queryable,Deserialize, Identifiable, Insertable, Serialize)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
}

pub fn query_posts(mut db: PooledConnection<ConnectionManager<PgConnection>>) -> Result<Vec<Post>> {
    use crate::schema::posts::dsl::*;

    info!("Querying posts");

    let results = posts
        .load::<Post>(&mut *db)?;

    //println!("Displaying {} posts", results.len());
    Ok(results)
}

// #[derive(Queryable, Deserialize, Identifiable, Insertable, Serialize)]
// #[diesel(primary_key(token_data_id_hash, property_version, owner_address))]
// #[diesel(table_name = current_token_ownerships)]
// pub struct CurrentTokenOwnership {
//     pub token_data_id_hash: String,
//     pub property_version: i32,
//     pub owner_address: String,
//     pub creator_address: String,
//     pub collection_name: String,
//     pub name: String,
//     pub amount: i32,
//     pub token_properties: serde_json::Value,
//     pub last_transaction_version: u64,
// }
//
//
// pub fn query_nfts_by_owner(mut db: PooledConnection<ConnectionManager<PgConnection>>, user_wallet:String) -> Result<Vec<CurrentTokenOwnership>> {
//     use crate::schema::current_token_ownerships::dsl::*;
//
//
//     info!("Querying NFTs by owner");
//
//     let results = current_token_ownerships
//         .load::<CurrentTokenOwnership>(&mut *db)?;
//
//     //println!("Displaying {} posts", results.len());
//     Ok(results)
// }
