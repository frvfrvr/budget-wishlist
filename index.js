// scrapped, according to docs, ALpineJS either accepts <script> tag or from bundle
// I was wrong, own extension code must be placed before AlpineJS cdn script tag. guess that worked.

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
};
function wishlist() {
    return {
        isLoading: false,
        /// budget and wishlist items part
        budget: '',
        item_name: '',
        item_cost: '',
        wishlist_items: [],
        add_wishlist(item, cost) {
            if (item == '' || cost == '') {
                return;
            } else {
                this.wishlist_items.push({
                    item: item,
                    cost: parseFloat(cost)
                });
            }
        },
        remove_wishlist(index) {
            this.wishlist_items.splice(index, 1);
        },
        up_list(index) {
            if (index > 0) {
                this.wishlist_items.splice(index - 1, 0, this.wishlist_items.splice(index, 1)[0])
            }
        },
        down_list(index) {
            if (index < this.wishlist_items.length - 1) {
                this.wishlist_items.splice(index + 1, 0, this.wishlist_items.splice(index, 1)[0])
            }
        },
        /// budgeting part
        calculate_total_cost() {
            let total_cost = 0;
            for (var i = 0; i < this.wishlist_items.length; i++) {
                total_cost += parseInt(this.wishlist_items[i]['cost']);
            }
            return parseInt(total_cost);
        },
        spend_each_cost(budget, items) {
            var remain_value = budget;
            var spent_list = [];

            for (var item of items) {
                var spent_value = Math.min(remain_value, item.cost);
                remain_value -= spent_value;
                spent_list.push(spent_value);
            }
            return spent_list;
        },
        spend_remain(budget, items) {
            var remain_value = budget;
            var remain_list = [];

            for (var item of items) {
                var spent_value = Math.min(remain_value, item.cost);
                remain_value -= spent_value;
                remain_list.push(remain_value);
            }
            return remain_list;
        },
        /// currency part
        currencies: [],
        isCustomCurrency: false,
        currency_picked: {
            ticker: '',
            symbol: ''
        },
        fetch_currencies() {
            this.isLoading = true;
            fetch('https://gist.githubusercontent.com/frvfrvr/11e74b2cd30f87a7cecab318b17430ce/raw/78fa0df210449e6cf6829014be6c55216ad5d05f/currlist.json')
                .then(response => response.json())
                .then(data => {
                    var result = [];
                    result.push({
                        key: '',
                        value: '',
                    });
                    result.push({
                        key: 'CUSTOM',
                        value: '',
                    });
                    for (var i in data) {
                        result.push({
                            key: i,
                            value: data[i],
                        });
                    }

                    this.isLoading = false;
                    this.currencies = result;
                });
        },
        checkCurrency(event) {
            this.currency_picked.ticker = event.currentTarget.value;
            if (this.currency_picked.ticker == 'CUSTOM') {
                this.isCustomCurrency = true;
                this.currency_picked.symbol = ''
            } else {
                this.isCustomCurrency = false;
                this.currency_picked.symbol = this.currencies.find(currency => currency.key === this.currency_picked.ticker).value;
            }
        },
        /// convert, read, import and export JSON part
        to_json() {
            let wishlist_items = {
                budget: parseFloat(this.budget),
                wishlist_items: JSON.stringify(this.wishlist_items, null, 2),
                currency_ticker: this.currency_picked.ticker,
                currency_symbol: this.currency_picked.symbol,
                custom_currency: this.isCustomCurrency,
            }
            return wishlist_items;
        },
        json_read(file) {
            let wishlist_items = JSON.parse(file);
            console.log(wishlist_items);
            this.budget = parseFloat(wishlist_items.budget);
            this.wishlist_items = JSON.parse(wishlist_items.wishlist_items);
            this.currency_picked.ticker = wishlist_items.currency_ticker;
            this.currency_picked.symbol = wishlist_items.currency_symbol;
            this.isCustomCurrency = wishlist_items.custom_currency;
            console.log(wishlist_items);
            return wishlist_items;
        },
        json_import() {
            let file = document.getElementById('file').files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => { let wishlist_items = this.json_read(reader.result) };
        },
        json_export() {
            let wishlist_items = this.to_json();
            let file = new Blob([JSON.stringify(wishlist_items, null, 2)], { type: 'application/json' });
            let a = document.createElement('a');
            let d = new Date();
            a.href = URL.createObjectURL(file);
            // `${d.toDateString().replace(/ /g, "_")}_wishlist_items.json`
            a.download = `wishlist_items.json`;
            a.click();


        },
        /// cache / local storage part
        clear_cache() {
            if (confirm("Are you sure you want to clear cache? \nStored list and budget will be lost!")) {
                localStorage.clear();
            }

        },
        update_save() {
            // localStorage things
            localStorage.budget = parseFloat(this.budget);
            localStorage.wishlist_items = JSON.stringify(this.wishlist_items, null, 2);
            localStorage.currency_ticker = this.currency_picked.ticker;
            localStorage.currency_symbol = this.currency_picked.symbol;
            localStorage.custom_currency = this.check_bool(this.isCustomCurrency);
        },
        /// page load part
        update_load() {
            // here is update the data on load, will add local storage feature
            this.budget = parseFloat(localStorage.budget) || '';
            this.wishlist_items = JSON.parse(localStorage.wishlist_items) || [];
            this.currency_picked.ticker = localStorage.currency_ticker || '';
            this.currency_picked.symbol = localStorage.currency_symbol || '';
            this.isCustomCurrency = this.check_bool(localStorage.custom_currency) || false;
        },
        /// boolean checking (Python can detect true or false strings as boolean with eval)
        check_bool(i) {
            var checkifTrue = (String(i).toLowerCase() === 'true');
            return checkifTrue;
        },
        /// theme check and toggle button
        theme_toggle() {
            var isDark = (localStorage.theme === 'dark');
            if (isDark == false) {
                localStorage.theme = 'dark';
                document.documentElement.classList.add('dark');
            } else {
                localStorage.theme = 'light';
                document.documentElement.classList.remove('dark');
            };
            console.log(isDark);
            return isDark;
        },
    }
}