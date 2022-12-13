use bigdecimal::BigDecimal;
use diesel::{PgConnection, QueryDsl, RunQueryDsl};
use field_count::FieldCount;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use anyhow::Result;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use crate::db::DbPool;


use crate::schema::current_token_ownerships;
//use crate::schema::current_token_ownerships::{dsl, owner_address,amount};

#[derive(Debug, Deserialize, FieldCount, Identifiable, Insertable, Serialize)]
#[diesel(primary_key(token_data_id_hash, property_version, owner_address))]
#[diesel(table_name = current_token_ownerships)]
pub struct CurrentTokenOwnership {
    pub token_data_id_hash: String,
    pub property_version: BigDecimal,
    pub owner_address: String,
    pub creator_address: String,
    pub collection_name: String,
    pub name: String,
    pub amount: BigDecimal,
    pub token_properties: serde_json::Value,
    pub last_transaction_version: i64,
    pub collection_data_id_hash: String,
    pub table_type: String,
    pub last_transaction_timestamp: chrono::NaiveDateTime,
}

pub fn query_nfts_by_owner(db: PooledConnection<ConnectionManager<PgConnection>>, user_wallet:String) -> Result<Vec<CurrentTokenOwnership>> {
    use crate::schema::current_token_ownerships::dsl::*;

    let results = current_token_ownerships
        .filter(owner_address.eq(user_wallet))
        .filter(amount.eq(1))
        .limit(10)
        .load::<CurrentTokenOwnership>(db)
        .expect("Error loading token ownerships");

    Ok(results)
}