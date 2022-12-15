import { Types, BCS } from 'aptos';
import { useWallet } from '@manahippo/aptos-wallet-adapter';


export default function LaunchPad() {

    const init_launchpad = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::launchpad::init_nft";
    const public_mint = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::launchpad::public_mint";
    const private_mint = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::launchpad::private_mint";

    const source = "0x215e8d37a09e0b5cef313638cba07a7969f0106fb9fa6411cf0fcd51a53388ef";

    const {
        autoConnect,
        connect,
        disconnect,
        account,
        wallets,
        signAndSubmitTransaction,
        connected,
        wallet: currentWallet
    } = useWallet();

    /* 
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
    total_supply: u64,
    collection_mutate_setting: vector<bool>,
    token_mutate_setting: vector<bool>,
    merkle_root: vector<u8>,
    seeds: vector<u8>, 
    */
    const wl = [
        "0xcaf1fbec4d4a122e2b2c1916259c81d9dee07b02a081aae1137a4fece01a6970",
        "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa",
        "0x8e70c47ba1faaf38b86b7e67261a0bae2faea83c3ded314f1344e1103accc661",
        "0x234e6e8a4b6ac229801a6b50c0443d0ece6f7734d1633b1123ab452249208c10",
        "0xd2dc9b8a02310198e4c563fd3c4babf75f2bcd277fcaa8591aeca05ca08006b",
        "0xab8add1854e09451ad7f84295362d598f326f4759bf30d6e9cb59e7d689c5fb8",
        "0xc65c97ca178220adf10ef8e4e6d0620756557fa4e0cd9219caef4d3f35e7a062",
        "0xa8f8331ac6ffb57aa1eee4c594a1973c9fdda5b1b71b3a6165bad39d0cc36c71",
        "0x7a007c845ba2f657a9b7fdd6430af28074b276bdf80790ead66625586ac1991a",
        "0xc5f21e22591559b035eca12dcc62611d6d270412233c4ded1e2e61ecdae336de",
        "0x6af8799342d52c7a302999fc2035297899ad210f0941f22a4b9004ec93332fb3",
        "0xa65bf2038905f36cb1b1325e989f218cc151481c98ffee830b5bcf729df596d0",
        "0xbf61f43e2a41828f071808c03921a3c2248161d86d202b07c8160765cf33346c",
        "0x704ba63b51b61540425b4be6ce5686faaad2ec171ae8bf7dd84aaa626354bfbb",
        "0x53de2903bb037c9bff6de5406491edd5183a4a768c92928b331c862012f4df9c",
        "0xf2c061271f2611f72708c994bc8b9460a0ebe2339ed0c138eb252fe90cfd3189",
        "0x46932e20180b837dfc22d1d903ab8395be38009e1f26001489fb78abfbc08076",
        "0x3836d577c9811b32ddf07ed04122403fe73a2f5d8e214f3695e74f4db46059f9",
        "0x6ba3218fcb52b07c72885d260d9752cd18fecd33d17aba4b7370525b70afeb02",
        "0x4626fba74e29d7c383af5b76a21b5b8a93f6e30bab417e0d190927f2496ae3ce",
        "0x63a3af46017b006d0eec243535fe5cbd27815c04e241c1eadf317cbc6a01a3b5",
        "0x1d4be25d86206befbf545d5e79c04f7d0726b28354471701b154143dfbc649fd",
        "0x7c8f0f1fe411bf7f709ba2b280ea1343bba9cae765c90b6d7eb626a74d1241fe",
        "0xc7077b98245c1882dc9473f98dee4cd0ec95b91192dcba5c093306e60f5078eb",
        "0xb6197d2fa74ea5e75165837807c18d514ed14de6cf61996653ca28686edc7582",
        "0x5f7fb27e779b4eb470344380c28cc435dc47f82e401ca2f4f588d05036af905f",
        "0xb707e9e4ca1012cab60a181ef82656c344cc0ca039384ef164dc442020ad4d77",
        "0xcaca05b838aa090bd3ec2b80ec67698f71be6ff08065dd72399b947b1d776f47",
        "0x875701cc6f4da7f2236df52c10523ac1483c5c221efba70d9fb7ad0cffcc9fc9",
        "0xc99f016264e9e7539e371512948cb23d01228bed0bb05ed62f5d67a3ac934375",
        "0x1a714310e5961c0491198e9e1821132485fbf0bdb731757d42a54dd5edd03602",
        "0xc54a92a2f27345229615c5d12db2bd348e706ab98b5ef1f1d514c27c77a8696b",
        "0xc44ee4f8ec2d8584a3874ebdf7f6831165c47130c8d9eccb5bfedae6688524a7",
        "0x55ee92d560d4c3ad26644120b28f70794dfd993da4ad7c0366fbad6248a5e17c",
        "0x8d56c73eaf900bc4180cd8fd0ff453821ff62a31b0eeddd34494485e24a7d8d0",
        "0x86dd185e7d74ba683a0f0eb2a6a5f91a18a792161e7e7e220b9257887cfb74f6",
        "0x95e9993b6ae69f4b68373447e9b0302f9d79399b743bc87726efe16d3617dd60",
        "0x82f69640b4ecdc3579f392e9fe07f55f5164cce4522b70180b175fc56d1ccd55",
        "0xc110423c3d7ea3fb2c4f7b994200f443d46bb0abac5f330aec7b6e830b88a545",
        "0x3addb377db65ee1541dbe5a13d99d9030996ad2de0b0f3a63b9a3a32ac18170",
        "0xf2c061271f2611f72708c994bc8b9460a0ebe2339ed0c138eb252fe90cfd3189",
        "0x4fbe50ac4af4e193204d172c42ffa1bf47887bbcd19648f22ecdd1436d5de44",
        "0xb714e3eb9d7417f0590bc66dffa58669d487ea2cf455df65ea212ce203fb3f4b",
        "0x7847eeefd959d67206d6d3f3c56c83ebd9dc9072bc1c1a1f8767ca6349c64e93",
        "0x553244cbe3898f0f4826b473b6026927489b7ebb4d262a1c853611d02bb46882",
        "0xd71ea0e323a35e4e1b7b4f3bde7749d54ebd20a97bbbdf70be0b47ff4475a50a",
        "0x776acfae0da3ff096ffb1fbed8bff71550505fe61b2331ad176a4e33a666e1c0",
        "0x603d752a9bb0d1dba8d34f3e06d2150b726618a6165934c27d1308c91a98d2bd",
        "0xf94df8e1f908bd1bfafb86b210ac9362322c783efa7cb3f0fea21f19db7b4009",
        "0x41d7dbb0ea68d8b8af08acb56b8f865a8c74efea9ac8f6abff9c105172b49163",
        "0xe45d56abc8d0fe98c1de3025db17c378b90c565f9ffec41312056a9318fb79a8",
        "0x1bccee5769a893a3a0873dc295c2b66073ec00b380ae2f45c674460aa6f3a799",
        "0x82e55b1d288d5f77120cfb1160afbf244b563a7c4c69ea492038d0ac018152bb",
        "0x887f184e4ae9da1b8e76b59541831bff5909e2e355446d85e1573dc14a0e76d5",
        "0xc9107016f9162c3862a2f39575d308f9c3cad98fde738f0e7fe4ae4d5e13802d",
        "0xe66cc216aa28a21ea78d7d2e2d235121d9f120dba029cfa042f1452a65375671",
        "0xc16a50695cb93fb5e17ed0390a1c9c5affe2cda1d336a1a862ca2484ff465449",
        "0xdace9c3447ab5e79c08735c6f2961e9b1fb699bf56a043b4295f25a39de67ba5",
        "0x78a93d64bd457798a56981ab53a783be306ac7689cfb7f3d355d40f6b24f06b5",
        "0x7a0ab7716cc3b54e69361f906ab3b7232729d3ab4b01fa31c0ab60822a84805c",
        "0x3fcda6207eb3d6d321df00a6d758425b7733c9fa65924f0d9cdc0cf92c04c8d4",
        "0xf91c4a8411bc833e567157828cb50e0e94e08428e385e3e2a37d22e017f44cfe",
        "0x8a8204441a3955af583aaf917f952d9dd76688314043fa8ef18d4de0519aa7cd",
        "0xd9b1357b7f1515429ded24efcf1b399fc8e6a09fdce1e12b081e75221a5095c4",
        "0xc4eb4940928ae45426f09fcb10c13709cd6ac9aaa744bb7e0eb8445fd24388f1",
        "0xa9864a1a55b1c97976ca4bc3333e0f222f792b8a526dff96d48f4a6e817d5961",
        "0xee197b10ccf0082b22bf615319fd1d00b251c8a87385f00a265e6aeab8dc412b",
        "0x9c53d2be2e843993cd018e0f2a522c11eba2c6cebdabb3a9bc694265786d805c",
        "0x361909cdee7625beb5b40ca2ac207724ec11b90950e849f7359d1164dcad4d07",
        "0xc27d4c183b1220c025b0799d236f70d9999aecf83b412f58591bf19771da379f",
        "0x66dd788ecd405db49c14098598bb01b45d0bc30a7da1e2181b69e970a01fd2e5",
        "0x780c67ec721ecb58b324f30c57856e3c75688d96a360d6b4abf38760601bcdb9",
        "0x584f70cf86ad95805b8ed68374c7af830a37030264d4221e4a7216c1d10335e4",
        "0xf410df0679fae8bc1f4a19f2f241ca2e3050cb019b8da348f2ef363383672296",
        "0x4463aef3d2cb7abc132aa59f14aacfee4e50c2bc1d5245a03ed844e2b529bbb9",
        "0x965904a6dd93ed4c531f59fefd12e10144cdc51cde1fc5deac51c0d2ae89e4b7",
        "0xb01b34f75184205ef34b4b97557b01878516205be11d7fba36bb61b4aa5c2eda",
        "0x8ae8ca3a8d1a8281d2a99ed83ad9e1e3fb18c7e2b928b5a7fa235bfe6797c435",
        "0x6a335ae6a338b862dc5136085476ea4b8a442e6be0b4c20217e4ec7bfdc1fd57",
        "0x19869ab05410057fab1e3078f69eca4d79b9facac7d09da4284db1762d8d65d3",
        "0xdd483602909973caaf9ac9e0274a95724e2497b72246ecbea3b584d87c77022b",
        "0xfb05ef1714dfb109340bfee7e6b316ed0d11f52240efe29028c10fb311e78a1",
        "0xae2e94116e3bafc642ac7117e4cea0b9bbbaef37b751b9b1fc5cdca59f940207",
        "0x1487fbb7b47a39d6912d3a8db5cf4d97f6349eed2baf19586418fd860a4e0aa0",
        "0xbddbef71a3117519789f965e4184d5c3a3798c6b07a8df87b2336402ea5e0a55",
        "0xbe38dad59bd32669ce0a5915923f9e3a3f6c62faa69c1c2933c349b0ff3ee38a",
        "0x7415b3c5c6f024baa2d1fbd26d5e4d0720161fad98ecc4e0159db466fca158c3",
        "0xd16c92b98998fff12cfd924b4a6501421d3dde011e0956bc49d7c364bac72665",
        "0x2c0b48bc2125554a767e5dba5db31d576acd54d4726cfb46a217537f14b793d2",
        "0x48b359030dde96cb86288da6e1e0c722d99969c233ac3abeb3ac6bb9e005676",
        "0x68ac460eb7f466bcab30303a61aa40963318f5427fb0cf5e18a363d4ade39ab1",
        "0xb5e3b9af48a1f29e19c5b32b3ac1e87456c76512ae2c07c2da8a842ac44a08e3",
        "0x2c9b5a79abe432aff3a7216e5a3a9e9dcf5519dc26b941fcee8c59748211de03",
        "0x2d25f7a6944860dba1ba1cd955c10229dca9f214ddaa5083651992144fc25003",
        "0xd46941d080c8d131b6a0966ed1b0a7bf64604f2ef47ee96d9539341dbb1cd54e",
        "0xe8fc6291704554644f07fa01398adb6e9b87a1d60572e5759892aeb53b999605",
        "0xc52700f6534ba0903a205a7fb963999a98712f13fb2b4786ec1c35452c3f0767",
        "0x3d1c0da2d6ae93b9e075b691f526e4254b3da0fcf46bcd1c36ec8d144d53319c",
        "0xe2bb9141d86b1a00075bc9962024f3e2b88d68d2a94a186e3b946c367b9c0d5a",
        "0x98a529ba2e2de9fa0759da9a2481765bb9d57603ee9c8648981e4addfb2f283a",
        "0xdd39d5352854b79a8ff1ccc7d28e231e0a6fd1731e2f89bc019c71cc60eef10f",
        "0xdc13709c406f56b9c7bf1425e6c89ee31562c7d9c90c9cf1bbe48b22aaea8fa1",
        "0x7c8f0f1fe411bf7f709ba2b280ea1343bba9cae765c90b6d7eb626a74d1241fe",
        "0x6874332280dac0e72b07532195135f23708da40d49b4a81271d70526d568f219",
        "0x7c59326c4e396205a634b21250ada08e0aebfc2275eae67962a55f690a0cae7b",
        "0xc78cc9a1d1c067a1aae4201a5d5b4754884abb49614c71ae5965b24926893239",
        "0x95e9993b6ae69f4b68373447e9b0302f9d79399b743bc87726efe16d3617dd60",
        "0x7a0ab7716cc3b54e69361f906ab3b7232729d3ab4b01fa31c0ab60822a84805c",
        "0x4626fba74e29d7c383af5b76a21b5b8a93f6e30bab417e0d190927f2496ae3ce",
        "0x4a7e97aab58b65f5fae247e4fed770e2473f29a571a33827863b3724a23d2cf1",
        "0xc17613c3ee749778cad3f3d6fc9ce597c3c2fba643d0ae92539e7f7b4a466ff9",
        "0xc64e68f217defecbd5f953f629197ecb041172e96b3a118cbe1a2991800ad411",
        "0xd141b84542c2a286380d5c53654e60c1fcc74dac5a6201398600c96684082d74",
        "0x8dcc9503e6bfc00adafedfac2cbfdd9650cc5ddecefd02828557a56fd623d9f5",
        "0xe9175c516bb205b5f1a76c754072db8926800da3e573f4b21a54feab2ffd42cf",
        "0x2c967250883fc4a7d61e033aac67c61f224db2810e6b75026047c752779b864d",
        "0x5f1f268a067eb06b20fdac9cb37fa2848ca899de4958c775ef3c0e32c0e6e0a1",
        "0xe638258733c9bfcbcda43178f0cf09081e8d5be779f682256a38d21fbf207a8c",
        "0x1c2d68d9c8814241d65ced77a567d016f044457a864f7d0cf9b21ee594e6d9c8",
        "0x42ed6c72600e174d94a51a928378919c17470d8c58c5dbc1c0e7652fa1d2b6cc",
        "0xc1dfa9b5e20540472dd8a18de6547285be7311f41131e05ab7bec81eae935544",
        "0x16dedd80662d620f471831577dc2f93970bf410c2bbbc802ab419963701a6c82",
        "0x890760095e005a2df091e946d9e63cc7f98ba9eaf3bfed1e3aaed2835ef824c1",
        "0x1f94c4b26594e3ffe44d9d1c24a4e2f889a36a226d557ac18ca847a7d0e4a49c",
        "0x211a5c2d3b2742dccef6a510a170e168bb52c31b0bc6ad7e280b155e57336c01",
        "0x1c6fb97b6a602eb105aad53e40127cda7f2130251937ead3b9a032fb48c8a59",
        "0x1c6fb97b6a602eb105aad53e40127cda7f2130251937ead3b9a032fb48c8a59",
        "0xd95ff04f2d727083c38180bfab760f78a8946cc09d552979987c610d10a1c16d",
        "0xbedb8c00fe49b0a20b99cce19eff7bfe8f9526da67957af8f8407f3b88f07a5b",
        "0x5e30580ef68f8bdd981698f60d20aeabc3480a7493c76308f39dc410b45dcc17",
        "0x344e4393320a9e568860e6edc9042d1046bf26c011ce93e5a947a9c3be64ea8d",
        "0xacaf177c02bf75aa9e54ced7cec8bab6c9095f5c5b2023b3b82b80cf21766d05",
        "0x13f7cb51c395ebf2613b4ae2e1f93edb0779f59a00e97c7c12411a406cb15aac",
        "0xe74b355b2a2cf7688db1dbd0c8e9cdecc6c069878fa38f0594ba8063ba95087e",
        "0x953e4e9e3adf3d6470b5eae9ae6a8642a64c8b8aea869c66c2583e4ff47dc3e7",
        "0x63ac53c07953c58fc4c37e2662c550d699327b9e466921755019e6b0b74a2184",
        "0x817a63edc185d2ed66f3de5d3f95a3808bed5f7619717eee70ba8cea52ec6b27",
        "0xabd35330369f8b1bcd1deed20b25c3536dce825c78c0c02377a72389732ae68a",
        "0xc86784ef2db05aa4941c86235c56a171bd55a2900cd79a87c4044fcf24be56de",
        "0x3241cdf6ecf6ea1df7264e63de356b6dd1e2e0504902cab35e421a58b083cff5",
        "0xacf1b679f81a0a60320d21cc1abf0b2178713c947f5296649f0f8ce9e870f5b3",
        "0x37213befe53ea7c775440636654a8b31464a969bc82b5cc15d9d07a243774cad",
        "0x718b8dca8f47749f7b49c8aefa308fc88a461e1f8b1609372440e2fd6305d4b4",
        "0x77318e34149ec59297228d95df4cd94cf14e3d645241217b1790128fa0923202",
        "0x6e2fcb48dd1a60c379e3a700a934974d68b9818581dc27ef2945f32b4865a58f",
        "0x81f2e068e6ae3e228e7da97e81fa6068ec40b0333d427346c3790a7ab1a1c8d5",
        "0x5716ab282c057040d688bb74f6055b4fbb8d96dfa4d4aac0dcde2f406420d0e2",
        "0x85221960a25f1f6cb926ae3f9952a509b6937dbad2c65db0b42edb1328c532ff",
        "0x233103f018a7ba076cce4c27fec6801d096f4794e8ad60ab21ed7e3254e16b69",
        "0x3041d8c32aa5c9b14eaf76ef6c984b6f61fff082c87fde4dbcde17604e74e9c8",
        "0x5b1078a3e900b0d11c1cd091788519dbb0f5c76324ff701b9dfaef1092fd1bb4",
        "0xbdc4f5549615b2f3b2a7e3ce3be10490acd57b619d1953640b683b2ff0a48549",
        "0xe9dc28d63550a83c8881f75e6311f0d515b2c061a4b71b364e12e93198dbe080",
        "0x15bff47c62ca5b4bb7a4fb6ed3416ff0f84e84099f8ff77db880e1e9e6eb19db",
        "0x1f94c4b26594e3ffe44d9d1c24a4e2f889a36a226d557ac18ca847a7d0e4a49c",
        "0xf66e96a569d706062bb6b7bc11462d8d82571e4dddc92968d0ff2e019621e027",
        "0x650b92615c89c340eb43d730020d2ef9e59397b3582e295ebbc7f24a0322048e",
        "0x2dde97fe3574844d8e718fa688c9781ec89a4ebcc5b373d0a431b16c0d59eae9",
        "0xed0637bc15a6624a6540868d039129e8684605a1c4db6e16781b788e24829e0c",
        "0xd605a34bbef305d7fac4fcd4e364fa28b944fa353fa1b5c0b9ac7eface755f88",
        "0x2d889e7231157147617e394c826a82bc69a91ac047732af968fd28124b97618a",
        "0x6e2fcb48dd1a60c379e3a700a934974d68b9818581dc27ef2945f32b4865a58f",
        "0x19527dd11e35331a43cd1fb7f15da42d8a1c335b1bc9596e2bc0861116f7702c",
        "0x337d4f7660a7d5bd6b9eec8224d9eeb184b1408cdeaa66608411b0a81f8e1fac",
        "0x477ba033a2be9e406edf9b9a7ae045214370f60078d433622cb6bfb934677c6d",
        "0xee5dc23bdc9ce5bbd83d05569a7138a2cad5625192b6d041f74a3b4492edddf8",
        "0xcf3c4d570c3490c23a78d35fee8a358e470deae9b136a8565a0ff61f689664cd",
        "0x424f4a7552d329327f1a9094cd95a33d9a21d60a59f2fad625a7b6c66dac7799",
        "0x9b6e9c20da82cd63ea665d7200839ce3e2dc01e9e0531aecd96c8f8451834c31",
        "0x374c547adf626e9a1c4ad335ed460d2ba08104ab103cae0f3fdec4411c9cec41",
        "0x85d5632acfb924e368821ef9d92272f99c9a4c051bf351c99c49e9c0ffb5c425",
        "0xc52c7db98118efbc9ce7930443fa4b0d609ea82c3faf1abb51749bc3096c45a7",
        "0xbeb292e29443d79d71a012f0bb32bef5d2c51935ed602f77d19d25594188235b",
        "0x5b1078a3e900b0d11c1cd091788519dbb0f5c76324ff701b9dfaef1092fd1bb4",
        "0x1d0da0b02f18c29de3978d369642862ba1823ba1fba8ff0612763d52eca9fa06",
        "0xa6c3ca953ad911a2776f7a5168e85e3b6fce53f7d2161616d213af9ea48d24e0",
        "0xdd7c855e4f93cd493b5e08f091367a57050984f5bd192a6cdcae271541669fc9",
        "0x1cfabec046b9d8c97ffecbf41d3dededf0f87d45ca0ce897ac5d2664d5670508",
        "0x9b0d80863ee78bb96304bf04e8ed37c6f6a14946a600194700769a715c1f170",
        "0x3154ae2fef51a3fddf11961db880911a68b08c0da15c9f9f79d2a92355c7b6c6",
        "0xc09dd517538530f9daffbadf0edaaca523d8a76b23b3451cf76f9dc1a7397779",
        "0xc995cef4840c4c2ad9b7d32b46fe2a671cbeec58faaffbb99a75d062d7388625",
        "0x102ea9da2732d443e14ca07045c5bc6a7fd47bdf70fda45a96c5d6822221307f",
        "0x211a5c2d3b2742dccef6a510a170e168bb52c31b0bc6ad7e280b155e57336c01",
        "0x772dc02af7d51efcb1a9eee267e460d8301378b5f85d82acb269c170028b7c62",
        "0xa9ccc3ded08a3f2f419dc58bcae3490b098e081a3e05409fc9cc8c42557229cd",
        "0xa54d1e1ab6868984e4e87015b53da9a7078632015e71706624a1b9fdc75fd150",
        "0x16dedd80662d620f471831577dc2f93970bf410c2bbbc802ab419963701a6c82",
        "0x3349b03c60d47e7889670b2c0d8546154b05122896f1c7fc975e98e3d0b15f39",
        "0x31d6d8f1d113fa1951b4148f0075bbe8c72d454b70dc51dde939947ba4add6c9",
        "0xa67cacd86f284d2d1924fd90a245c60cbd0e9ccbe0ae7c6fd780477a70b4ca31",
        "0x39214e0ec8838388a529cf634464b8d3685834b9336b96be59a253e77036ceec",
        "0x74beed575e4d24c7fc5eec262a4be81ba077e0adffef1332028f58839dce425d",
        "0x26bddf88f1cd2eac2f4a7f8e908cbd58b98f7ab75b90967ed885799d06844c18",
        "0x6d99e98030e997ac9407848691cc70d3f328e9406b7baa27423054ce2d1b7f11",
        "0x1d59257ba7429a3688e94bd9fdc144e7b31eaf8cf93c4ee9cdf59cb77e57b9aa",
        "0xaf9aba198c980618fcaf10ce552585eec578258a595fcd61f19b92c2566423cc",
        "0x3965106df7bd8fc42fc44964a07f805e3eac84b0800233be7022a73cdfd55ad5",
        "0xacf1b679f81a0a60320d21cc1abf0b2178713c947f5296649f0f8ce9e870f5b3",
        "0xccc3936cc063be341e990dfdd99c83daaba514ecfc2afaf587dcf6973ed0f450",
        "0x3ab21ca7fca10b3eb0ae73b5add8b43cf00d47059fb6f0a65c54e0e2170f1dbb",
        "0xaa531d88f7f357f3d54ce9a95a543e99aa0a00941273b12e32eb826fcf834770",
        "0x389d5bfedc2af96caddb233afc883a3e316912004b77b0bc63c741e6bd5d4b4c",
        "0x3041d8c32aa5c9b14eaf76ef6c984b6f61fff082c87fde4dbcde17604e74e9c8",
        "0x74b7fd5b3704b2988a6e664b561f7f1748b76587c59594bdb83ef7bbefe35069",
        "0xd3282852eba80854226c459697929dfda08b450f87b7a3b933eab5cd8be1fa42",
        "0xc17613c3ee749778cad3f3d6fc9ce597c3c2fba643d0ae92539e7f7b4a466ff9",
        "0xe1dcb116f4691e03181cccaa418bc046674a1a49c0af2525aa914113f1cee3e3",
        "0x46c9f90898ed497b4db273b6370ddede0a3a353475d0e37ac76909e23dbd2fce",
        "0xe4a5c1857c059106376615956d8b77f7cc652d61009d9db902899fe6f1da8501",
        "0x345ae6a875c579bdc915adb8551b0092f31dd9485b34c64fa89261d5c67b7913",
        "0x1aae6a169f9611d064d51d5520d2c070e1df58b6cbe301337b347aa90683b6a",
        "0x55c92b8ada9587bbafac99013095e04057f7fd226ca32946d1cc214b07b8fa4e",
        "0x4ab9cda08278037a6b6c60ef537c6532fea22d37654f2c39ff346f6b372be93e",
        "0xa17f5e9a879669451a3f62ee0fd7dcc466c16ba21eac45c4f4feb06c75c0d9a0",
        "0x8a8d77f1a9113efd654cce6d54cfcd932663413f96090e045768e3c29292a7ef",
        "0xbedb8c00fe49b0a20b99cce19eff7bfe8f9526da67957af8f8407f3b88f07a5b",
        "0x19527dd11e35331a43cd1fb7f15da42d8a1c335b1bc9596e2bc0861116f7702c",
        "0x71e8e52fcb2ff4462f47e72c02f617824b3342ddd9c39e608304e27d8ef55257",
        "0xb16fe728c86259ac0e38653f180c547a850f931b5e6f1a0ca23208ac76e64948",
        "0x8ec2f7cfb01e7d30613f6c0d6d8a3ccb275e5b2df37acf7a86805b0d3a64586d",
        "0xe84373458e23ec540c6024ab5b2f5a3858bb888db5adfc66c7336428afd0f533",
        "0x6874332280dac0e72b07532195135f23708da40d49b4a81271d70526d568f219",
        "0xedda675efbdfadd6be30ab625860ce19932eac834717c8c2f338f43665c05f51"
    ];

    const { MerkleTree } = require('merkletreejs')
    const CryptoJS = require('crypto-js')
    const SHA256 = require('crypto-js/sha256')

    const sha256forWallets = (wallet: string) => {
        return SHA256(CryptoJS.enc.Hex.parse(wallet.slice(2)));
    }

    const leaves = wl.map(x => sha256forWallets(x))
    const tree = new MerkleTree(leaves, SHA256, { sortPairs: true })
    let root = tree.getRoot().toString('hex')
    console.log(root);

    console.log(sha256forWallets("0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa").toString());
    console.log(account?.address);
    const leaf = sha256forWallets("0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa");
    let proof = tree.getProof(leaf);
    console.log(tree.verify(proof, leaf, root));

    proof = proof.map((x: any) => [].slice.call(x.data));
    console.log('proof:');
    console.log(proof);


    //const proof = tree.
    // const proof = tree.p
    // console.log(proof);


    /*    root = BCS.bcsSerializeBytes(Buffer.from(root, 'hex')),
           console.log(root); */
    root = Buffer.from(root, 'hex');
    console.log(root);
    root = [].slice.call(root);
    console.log(root);

    const init_nft = async () => {
        const txOptions = {
            max_gas_amount: '100000',
            gas_unit_price: '100'
        };

        const payload: Types.TransactionPayload = {
            type: 'entry_function_payload',
            function: init_launchpad,
            type_arguments: [],
            arguments: [
                'Test Nft',
                'Test Nft',
                'https://static.bluemove.net/aptos-cerise-metadata/',
                '0x7f3d4f0094a49421bdfca03366fa02add69d9091c76a4a0fe498caa163886fc0',
                "10000",
                "5000",
                "1670511905",
                "1670511905",
                "100000000",
                "100000000",
                "5",
                "5",
                "1670745982",
                "1670745982",
                false,
                "55",
                false,
                "200",
                [true, true, true, true, true],
                [true, true, true, true, true],
                root,
                [1, 2, 3, 4, 3],
            ]
        };

        console.log(payload);

        const transactionRes = await signAndSubmitTransaction(payload, txOptions);
        console.log(transactionRes);

        //await aptosClient.waitForTransaction(transactionRes?.hash || '');
    }


    const mint = async () => {
        const txOptions = {
            max_gas_amount: '100000',
            gas_unit_price: '100'
        };

        /*         const payload: Types.TransactionPayload = {
                    type: 'entry_function_payload',
                    function: public_mint,
                    type_arguments: [],
                    arguments: [
                        source,
                        "1",
                    ]
                };
         */
        const payload: Types.TransactionPayload = {
            type: 'entry_function_payload',
            function: private_mint,
            type_arguments: [],
            arguments: [
                proof,
                source,
                1,
            ]
        };

        console.log(payload);
        const transactionRes = await signAndSubmitTransaction(payload, txOptions);
        console.log(transactionRes);
    }

    return (
        <div className="justify-center w-full items-connect">
            <button className="mx-auto center btn btn-primary" onClick={() => mint()}>MINT</button>

            <button className="mx-auto center btn btn-primary" onClick={() => init_nft()}>INIT</button>
        </div>
    )
}

