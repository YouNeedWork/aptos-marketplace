module CargosMarket::marketplace {
    use aptos_token::token::{Token, TokenId};
    use aptos_std::table::Table;
    use std::signer;
    use aptos_token::token;
    use std::string::String;
    use aptos_std::table;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin;
    use std::vector;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Coin};

    struct ListedItem has store {
        price: u64,
        locked_token: Token,
        seller: address,
        offers: vector<ItemOffer>,
    }

    struct ItemOffer has store {
        buyer: address,
        amount: Coin<AptosCoin>,
    }

    struct CargosMarket has key {
        market_depositor: address,
        market_denominator: u64,
        market_fee: u64,
        items: Table<TokenId, ListedItem>
    }

    public fun init_model(owner:&signer){
        //init signer
        if (!exists<CargosMarket>(@CargosMarket)) {
            move_to(owner, CargosMarket {
                market_denominator:10000,
                market_fee: 200,
                market_depositor:@CargosMarket,
                 items: table::new<TokenId, ListedItem>(),
            });
        };
    }

    public entry fun list_token(
        sender: &signer,
        creators: vector<address>,
        collection_names: vector<String>,
        names: vector<String>,
        prices: vector<u64>,
    ) acquires CargosMarket {
        assert!(!vector::is_empty(&creators), 0);
        assert!(!vector::is_empty(&collection_names), 0);
        assert!(!vector::is_empty(&names), 0);
        assert!(!vector::is_empty(&prices), 0);

        assert!(
            vector::length(&creators) == vector::length(&collection_names) &&
                vector::length(&creators) == vector::length(&names) &&
                vector::length(&creators) == vector::length(&prices),
            0
        );

        let listed_items_data = borrow_global_mut<CargosMarket>(@CargosMarket);
        let listed_items = &mut listed_items_data.items;

        let i = 0;
        let creators_length = vector::length(&creators);

        while (i < creators_length) {
            let creator = *vector::borrow(&creators, i);
            let collection_name = *vector::borrow(&collection_names, i);
            let name = *vector::borrow(&names, i);
            let price = *vector::borrow(&prices, i);


            let token_id = token::create_token_id_raw(creator, collection_name, name, 0);
            let token = token::withdraw_token(sender, token_id, 1);
            table::add(listed_items, token_id, ListedItem {
                price,
                locked_token: token,
                seller:signer::address_of(sender),
                offers: vector::empty(),
            });

            //TODO emit event
            i = i + 1;
        }
    }

    // public entry fun list_token(
    //     sender: &signer,
    //     creator: address,
    //     collection_name: String,
    //     name: String,
    //     price: u64
    // ) acquires ListedItemsData {
    //     let sender_addr = signer::address_of(sender);
    //     if (!exists<ListedItemsData>(sender_addr)) {
    //         move_to(sender, ListedItemsData {
    //             listed_items: table::new<TokenId, ListedItem>(),
    //         });
    //     };
    //
    //     let listed_items_data = borrow_global_mut<ListedItemsData>(sender_addr);
    //     let listed_items = &mut listed_items_data.listed_items;
    //
    //     let token_id = token::create_token_id_raw(creator, collection_name, name, 0);
    //     let token = token::withdraw_token(sender, token_id, 1);
    //     table::add(listed_items, token_id, ListedItem {
    //         price,
    //         locked_token: token,
    //         offers: vector::empty(),
    //     })
    // }


    public entry fun buy_token(
        sender: &signer,
        creators: vector<address>,
        collection_names: vector<String>,
        names: vector<String>,
    ) acquires CargosMarket {
        assert!(!vector::is_empty(&creators), 0);
        assert!(!vector::is_empty(&collection_names), 0);
        assert!(!vector::is_empty(&names), 0);

        assert!(
            vector::length(&creators) == vector::length(&collection_names) &&
                vector::length(&creators) == vector::length(&names),
            0
        );

        let listedItemsData = borrow_global_mut<CargosMarket>(@CargosMarket);
        let listed_items = &mut listedItemsData.items;


        let i = 0;
        let creators_length = vector::length(&creators);
        while (i < creators_length) {
            let creator = *vector::borrow(&creators, i);
            let collection_name = *vector::borrow(&collection_names, i);
            let name = *vector::borrow(&names, i);

            let token_id = token::create_token_id_raw(creator, collection_name, name, 0);

            //check if token is listed
            let ListedItem { price, locked_token,seller, offers } = table::remove(listed_items, token_id);
            cancel_offer(&mut offers);
            vector::destroy_empty(offers);
            let market_amount = price * listedItemsData.market_fee / listedItemsData.market_denominator;

            let royalty = token::get_royalty(token_id);
            let create_amount = price * token::get_royalty_numerator(&royalty) / token::get_royalty_denominator(&royalty);
            let seller_amount = price - market_amount - create_amount;

            coin::transfer<aptos_coin::AptosCoin>(sender, listedItemsData.market_depositor, market_amount);
            coin::transfer<aptos_coin::AptosCoin>(sender, token::get_royalty_payee(&royalty), create_amount);
            coin::transfer<aptos_coin::AptosCoin>(sender, seller, seller_amount);

            token::deposit_token(sender, locked_token);

            //TODO emit event

            i = i + 1;
        }
    }

    // public entry fun buy_token(
    //     sender: &signer,
    //     seller: address,
    //     creator: address,
    //     collection_name: String,
    //     name: String,
    // ) acquires ListedItemsData {
    //     let sender_addr = signer::address_of(sender);
    //     assert!(sender_addr != seller, 0);
    //
    //     let listedItemsData = borrow_global_mut<ListedItemsData>(seller);
    //     let listed_items = &mut listedItemsData.listed_items;
    //
    //     let token_id = token::create_token_id_raw(creator, collection_name, name, 0);
    //     let listed_item = table::borrow_mut(listed_items, token_id);
    //
    //
    //     let ListedItem { price, locked_token, offers } = table::remove(listed_items, token_id);
    //     cancel_offer(&mut offers);
    //     vector::destroy_empty(offers);
    //     coin::transfer<aptos_coin::AptosCoin>(sender, seller, price);
    //     token::deposit_token(sender, locked_token)
    // }

    fun cancel_offer(offers: &mut vector<ItemOffer>) {
        let i = 0;
        let offer_length = vector::length(offers);
        while (i < offer_length) {
            let ItemOffer { buyer, amount } = vector::remove(offers, i);
            coin::deposit<aptos_coin::AptosCoin>(buyer, amount);
            i = i + 1;
        }
    }
}
