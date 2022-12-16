module CargosMarket::launchpad {
    use std::signer;
    use std::bcs;
    use std::hash;
    use aptos_std::from_bcs;
    use std::string::{Self, String};
    use std::vector;
    use std::error;
    use std::bit_vector::{Self, BitVector};
    use aptos_framework::coin::{Self};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_token::token::{Self, Token};
    use aptos_std::table::Table;
    use aptos_std::table;
    use CargosMarket::merkle_proof;
    #[test_only]
    use std::signer::address_of;
    use aptos_framework::event;
    use aptos_framework::event::EventHandle;


    const INVALID_SIGNER: u64 = 0;
    const INVALID_AMOUNT: u64 = 1;
    const CANNOT_ZERO: u64 = 2;
    const EINVALID_ROYALTY_NUMERATOR_DENOMINATOR: u64 = 3;
    const ESALE_NOT_STARTED: u64 = 4;
    const ESOLD_OUT: u64 = 5;
    const EPAUSED: u64 = 6;
    const EINVALID_FREEZE:u64 = 7;
    const INVALID_PROOF: u64 = 8;


    struct TokenMintingEvent has drop, store {
        token_receiver_address: address,
        token_data_id: token::TokenDataId,
    }

    struct ClamTokenEvent has drop, store {
        token_receiver_address: address,
        token_data_id: token::TokenDataId,
    }


    // Launch Resource for any account who's call init
    struct Launch has key {
        collection_name: String,
        collection_description: String,
        baseuri: String,
        royalty_payee_address: address,
        royalty_points_denominator: u64,
        royalty_points_numerator: u64,
        presale_mint_time: u64,
        public_sale_mint_time: u64,
        presale_mint_amount: u64,
        presale_mint_price: u64,
        public_sale_mint_price: u64,
        public_mint_amount: u64,
        presale_end_time:u64,
        public_sale_end_time:u64,
        paused: bool,
        total_supply: u64,
        minted: u64,
        freeze: bool,
        freelaunch: bool,
        tax_fee:u64,
        freeze_tokens: Table<address, vector<token::Token>>,
        minted_by_users: Table<address, u64>,
        token_mutate_setting: vector<bool>,
        candies: vector<BitVector>,
        merkle_root: vector<u8>,
    }

    struct ResourceInfo has key {
        resource_cap: account::SignerCapability,
        mint_event:EventHandle<TokenMintingEvent>,
        clam_event:EventHandle<ClamTokenEvent>,
    }

    public entry fun init_nft(
        account: &signer,
        collection_name: String,
        collection_description: String,
        baseuri: String,
        royalty_payee_address: address,
        royalty_points_denominator: u64,
        royalty_points_numerator: u64,
        presale_mint_time: u64,
        public_sale_mint_time: u64,
        presale_mint_price: u64,
        public_sale_mint_price: u64,
        presale_mint_amount: u64,
        public_mint_amount: u64,
        presale_end_time:u64,
        public_sale_end_time:u64,
        freeze:bool,
        total_supply: u64,
        freelaunch: bool,
        tax_fee:u64,
        collection_mutate_setting: vector<bool>,
        token_mutate_setting: vector<bool>,
        merkle_root: vector<u8>,
        seeds: vector<u8>,
    ) {
        let (_resource, resource_cap) = account::create_resource_account(account, seeds);
        let resource_signer_from_cap = account::create_signer_with_capability(&resource_cap);

        move_to<ResourceInfo>(
            &resource_signer_from_cap,
            ResourceInfo {
                resource_cap,
                mint_event:account::new_event_handle<TokenMintingEvent>(&resource_signer_from_cap),
                clam_event:account::new_event_handle<ClamTokenEvent>(&resource_signer_from_cap)
            }
        );

        assert!(royalty_points_denominator > 0, error::invalid_argument(EINVALID_ROYALTY_NUMERATOR_DENOMINATOR));
        assert!(
            royalty_points_numerator <= royalty_points_denominator,
            error::invalid_argument(EINVALID_ROYALTY_NUMERATOR_DENOMINATOR)
        );

        let candies_data = create_bit_mask(total_supply);

        move_to<Launch>(&resource_signer_from_cap, Launch {
            collection_name,
            collection_description,
            baseuri,
            royalty_payee_address,
            royalty_points_denominator,
            royalty_points_numerator,
            presale_mint_time,
            public_sale_mint_time,
            presale_mint_price,
            public_sale_mint_price,
            presale_mint_amount,
            public_mint_amount,
            total_supply,
            minted: 0,
            freeze,
            paused: false,
            freelaunch,
            tax_fee,
            presale_end_time,
            public_sale_end_time,
            freeze_tokens:table::new(),
            minted_by_users: table::new(),
            candies: candies_data,
            token_mutate_setting,
            merkle_root,
        });

        token::create_collection(
            &resource_signer_from_cap,
            collection_name,
            collection_description,
            baseuri,
            0,
            collection_mutate_setting
        );
    }

    public entry fun private_mint(
        receiver: &signer,
        proof: vector<vector<u8>>,
        launch_resouce_account: address,
        number: u64,
    ) acquires ResourceInfo, Launch {
        let receiver_addr = signer::address_of(receiver);
        let resource_data = borrow_global<ResourceInfo>(launch_resouce_account);
        let resource_signer_from_cap = account::create_signer_with_capability(&resource_data.resource_cap);
        let launch_data = borrow_global_mut<Launch>(launch_resouce_account);
        let now = aptos_framework::timestamp::now_seconds();
        // check merkle_proof
        assert!(merkle_proof::verify(&proof, launch_data.merkle_root, hash::sha2_256(bcs::to_bytes(&receiver_addr))),INVALID_PROOF);
        assert!(number <= launch_data.presale_mint_price, INVALID_AMOUNT);
        assert!(launch_data.paused == false, EPAUSED);
        assert!(launch_data.minted != launch_data.total_supply, ESOLD_OUT);
        assert!(now > launch_data.presale_mint_time, ESALE_NOT_STARTED);

        // check already minted.
        if (table::contains(&launch_data.minted_by_users, receiver_addr)) {
            let mint_by_receiver = table::borrow_mut(&mut launch_data.minted_by_users, receiver_addr);
            assert!(*mint_by_receiver + number <= launch_data.public_mint_amount, INVALID_AMOUNT);
            *mint_by_receiver = *mint_by_receiver + number;
        } else {
            table::add(&mut launch_data.minted_by_users, receiver_addr, number);
        };

        // Open transfer && transfer to coin to create
        token::opt_in_direct_transfer(receiver, true);

        // take launchpad fee.
        if (launch_data.freelaunch) {
            coin::transfer<0x1::aptos_coin::AptosCoin>(
                receiver,
                launch_data.royalty_payee_address,
                launch_data.public_sale_mint_price * number
            );
        } else {
            let tax = launch_data.public_mint_amount * number * launch_data.tax_fee / launch_data.royalty_points_denominator;
            let mint_fee = launch_data.public_sale_mint_price * number - tax;

            coin::transfer<0x1::aptos_coin::AptosCoin>(
                receiver,
                @CargosMarket,
                tax
            );

            coin::transfer<0x1::aptos_coin::AptosCoin>(
                receiver,
                launch_data.royalty_payee_address,
                mint_fee
            );
        };

        let i = 0;
        while (i < number) {
            let token_data_id = mint_random(receiver_addr, launch_data, launch_resouce_account,&resource_signer_from_cap);
            if (launch_data.freeze) {
                let token_id = token::create_token_id(token_data_id, 0);
                let t = token::withdraw_token(receiver, token_id,1);
                freeze_token(launch_data,receiver_addr,t);
            };

            event::emit_event(*resource_data.mint_event,TokenMintingEvent{
                token_receiver_address:receiver_addr,
                token_data_id
            });

            i =i+1;
        };

        //Check if mintend. we changed the timestrap to now, then user can't clam him tokens
        if (launch_data.minted == launch_data.total_supply) {
            launch_data.public_sale_end_time = now;
            launch_data.presale_end_time = now;
        };
    }

    public entry fun public_mint(
        receiver: &signer,
        launch_resouce_account: address,
        number: u64,
    ) acquires ResourceInfo, Launch {
        let receiver_addr = signer::address_of(receiver);
        let resource_data = borrow_global<ResourceInfo>(launch_resouce_account);
        let resource_signer_from_cap = account::create_signer_with_capability(&resource_data.resource_cap);
        let launch_data = borrow_global_mut<Launch>(launch_resouce_account);
        assert!(number <= launch_data.public_mint_amount, INVALID_AMOUNT);
        assert!(launch_data.paused == false, EPAUSED);
        assert!(launch_data.minted != launch_data.total_supply, ESOLD_OUT);

        let now = aptos_framework::timestamp::now_seconds();
        assert!(now > launch_data.public_sale_mint_time, ESALE_NOT_STARTED);

        // check already minted.
        if (table::contains(&launch_data.minted_by_users, receiver_addr)) {
            let mint_by_receiver = table::borrow_mut(&mut launch_data.minted_by_users, receiver_addr);
            assert!(*mint_by_receiver + number <= launch_data.public_mint_amount, INVALID_AMOUNT);
            *mint_by_receiver = *mint_by_receiver + number;
        } else {
            table::add(&mut launch_data.minted_by_users, receiver_addr, number);
        };

        // Open transfer && transfer to coin to create
        token::opt_in_direct_transfer(receiver, true);

        // take launchpad fee.
        if (launch_data.freelaunch) {
            coin::transfer<0x1::aptos_coin::AptosCoin>(
                receiver,
                launch_data.royalty_payee_address,
                launch_data.public_sale_mint_price * number
            );
        } else {
            let tax = launch_data.public_mint_amount * number * launch_data.tax_fee / launch_data.royalty_points_denominator;
            let mint_fee = launch_data.public_sale_mint_price * number - tax;

            coin::transfer<0x1::aptos_coin::AptosCoin>(
                receiver,
                @CargosMarket,
                tax
            );

            coin::transfer<0x1::aptos_coin::AptosCoin>(
                receiver,
                launch_data.royalty_payee_address,
                mint_fee
            );
        };

        let i = 0;
        while (i < number) {
            let token_data_id = mint_random(receiver_addr, launch_data, launch_resouce_account,&resource_signer_from_cap);
            if (launch_data.freeze) {
                let token_id = token::create_token_id(token_data_id, 0);
                let t = token::withdraw_token(receiver, token_id,1);
                freeze_token(launch_data,receiver_addr,t);
            };

            event::emit_event(*resource_data.mint_event,TokenMintingEvent{
                token_receiver_address:receiver_addr,
                token_data_id
            });

            i =i+1;
        };

        //Check if mintend. we changed the timestrap to now, then user can't clam him tokens
        if (launch_data.minted == launch_data.total_supply) {
            launch_data.public_sale_end_time = now;
            launch_data.presale_end_time = now;
        };
    }


    // Then mint done. and end for freeze time. users can clam tokens
    public entry fun clam_tokens(recver:&signer,launch_resouce_account: address) acquires Launch,ResourceInfo {
        let receiver_addr = signer::address_of(recver);
        let resource_data = borrow_global<ResourceInfo>(launch_resouce_account);
        let launch_data = borrow_global_mut<Launch>(launch_resouce_account);
        assert!(launch_data.freeze == true, EINVALID_FREEZE);
        assert!(table::contains(&launch_data.freeze_tokens, receiver_addr), EINVALID_FREEZE);
        token::opt_in_direct_transfer(recver,true);

        let tokens = table::borrow_mut(&mut launch_data.freeze_tokens, receiver_addr);
        let i = 0;
        let token_lenge = vector::length(tokens);
        while (i < token_lenge) {
            let t = vector::remove(tokens,i);

            token::deposit_token(recver, t);

            // event::emit_event(*resource_data.mint_event,TokenMintingEvent{
            //     token_receiver_address:receiver_addr,
            //     token_data_id
            // });

            i = i + 1;
        }
    }

    // add freeze token to launch_data
    fun freeze_token(
        launch_data: &mut Launch,
        receiver_addr: address,
        t:Token
    ) {
        if (table::contains(&launch_data.freeze_tokens,receiver_addr)) {
            let freeze = table::borrow_mut(&mut launch_data.freeze_tokens, receiver_addr);
            vector::push_back(freeze, t);
        } else {
            let freeze = vector::empty<Token>();
            vector::push_back(&mut freeze, t);
            table::add(&mut launch_data.freeze_tokens, receiver_addr, freeze);
        };
    }


    // inner mint only call by self
    fun mint_random(
        receiver_addr: address,
        launch_data: &mut Launch,
        collect_address:address,
        cap_signer: &signer,
    ): token::TokenDataId {
        let remaining = launch_data.total_supply - launch_data.minted;
        let random_index = pseudo_random(receiver_addr, remaining);

        // let (mint_position,candies) = mint_available_number(random_index,candy_data.candies);
        // candy_data.candies = candies;
        let required_position = 0; // the number of unset
        let bucket = 0; // number of buckets
        let pos = 0; // the mint number
        let new = vector::empty();

        while (required_position < random_index)
            {
                let bitvector = *vector::borrow_mut(&mut launch_data.candies, bucket);
                let i = 0;
                while (i < bit_vector::length(&bitvector)) {
                    if (!bit_vector::is_index_set(&bitvector, i))
                        {
                            required_position = required_position + 1;
                        };
                    if (required_position == random_index)
                        {
                            bit_vector::set(&mut bitvector, i);
                            vector::push_back(&mut new, bitvector);
                            break
                        };
                    pos = pos + 1;
                    i = i + 1;
                };
                vector::push_back(&mut new, bitvector);
                bucket = bucket + 1
            };

        while (bucket < vector::length(&launch_data.candies))
            {
                let bitvector = *vector::borrow_mut(&mut launch_data.candies, bucket);
                vector::push_back(&mut new, bitvector);
                bucket = bucket + 1;
            };

        let mint_position = pos;

        launch_data.candies = new;
        let baseuri = launch_data.baseuri;
        let properties = vector::empty<String>();
        string::append(&mut baseuri, num_str(mint_position));
        let token_name = launch_data.collection_name;
        string::append(&mut token_name, string::utf8(b" #"));
        string::append(&mut token_name, num_str(mint_position));
        string::append(&mut baseuri, string::utf8(b".json"));
        let token_mut_config = token::create_token_mutability_config(&launch_data.token_mutate_setting);
        token::create_tokendata(
            cap_signer,
            launch_data.collection_name,
            token_name,
            launch_data.collection_description,
            1,
            baseuri,
            launch_data.royalty_payee_address,
            launch_data.royalty_points_denominator,
            launch_data.royalty_points_numerator,
            token_mut_config,
            properties,
            vector<vector<u8>>[],
            properties
        );

        let token_data_id = token::create_token_data_id(
            collect_address,
            launch_data.collection_name,
            token_name
        );

        token::mint_token_to(
            cap_signer,
            receiver_addr,
            token_data_id,
            1
        );

        launch_data.minted = launch_data.minted + 1;

        token_data_id
    }


    // utils
    fun num_str(num: u64): String
    {
        let v1 = vector::empty();
        while (num / 10 > 0) {
            let rem = num % 10;
            vector::push_back(&mut v1, (rem + 48 as u8));
            num = num / 10;
        };
        vector::push_back(&mut v1, (num + 48 as u8));
        vector::reverse(&mut v1);
        string::utf8(v1)
    }


    fun pseudo_random(add: address, remaining: u64): u64
    {
        let x = bcs::to_bytes<address>(&add);
        let y = bcs::to_bytes<u64>(&remaining);
        let z = bcs::to_bytes<u64>(&timestamp::now_seconds());
        vector::append(&mut x, y);
        vector::append(&mut x, z);
        let tmp = hash::sha2_256(x);

        let data = vector::empty<u8>();
        let i = 24;
        while (i < 32)
            {
                let x = vector::borrow(&tmp, i);
                vector::append(&mut data, vector<u8>[*x]);
                i = i + 1;
            };

        assert!(remaining > 0, 999);
        let random = from_bcs::to_u64(data) % remaining + 1;
        if (random == 0)
            {
                random = 1;
            };
        random
    }


    fun create_bit_mask(nfts: u64): vector<BitVector>
    {
        let full_buckets = nfts / 1024;
        let remaining = nfts - full_buckets * 1024;
        if (nfts < 1024)
            {
                full_buckets = 0;
                remaining = nfts;
            };
        let v1 = vector::empty();
        while (full_buckets > 0)
            {
                let new = bit_vector::new(1023);
                vector::push_back(&mut v1, new);
                full_buckets = full_buckets - 1;
            };
        vector::push_back(&mut v1, bit_vector::new(remaining));
        v1
    }



    #[test(account = @0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa)]
    fun test_hash(account: signer){
        use std::bcs;
        use aptos_std::debug;
        use std::hash;

        let address = address_of(&account);
        let wallet_byte = bcs::to_bytes<address>(&address);
        debug::print<vector<u8>>(&wallet_byte);
        debug::print<vector<u8>>(&hash::sha2_256(wallet_byte));
        //0xec4916dd28fc4c10d78e287ca5d9cc51ee1ae73cbfde08c6b37324cbfaac8bc5
        //0x20b1ecb75e57727028a749089a8055f137527f1697b8df7e49c6be283cad85bc
    }
}