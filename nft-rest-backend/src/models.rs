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


#[derive(Debug,Queryable, Deserialize, FieldCount, Identifiable, Insertable, Serialize)]
#[diesel(primary_key(token_data_id_hash, property_version, owner_address))]
#[diesel(table_name = current_token_ownerships)]
pub struct CurrentTokenOwnership {
    pub token_data_id_hash: String,
    pub property_version: i64,
    pub owner_address: String,
    pub creator_address: String,
    pub collection_name: String,
    pub name: String,
    pub amount: i64,
    pub token_properties: Value,
    pub last_transaction_version: i64,
    pub inserted_at:chrono::NaiveDateTime,
}

pub fn query_nfts_by_owner(mut db: PooledConnection<ConnectionManager<PgConnection>>, user_wallet:&str) -> Result<Vec<CurrentTokenOwnership>> {
    use crate::schema::current_token_ownerships::dsl::*;

    let results = current_token_ownerships
        .filter(owner_address.eq(user_wallet))
        .filter(amount.gt(0))
        .limit(20)
        .load::<CurrentTokenOwnership>(&mut *db)?;

    println!("Displaying {} posts", results.len());
    Ok(results)
}
