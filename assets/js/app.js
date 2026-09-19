/* ============================================================
   FURY AGENCY — Landing page interactivity (agencyfury.online)
   Price estimator + order routing (WhatsApp / PayPal / email)
   ============================================================ */
(function () {
    'use strict';

    var SERVICE_PRICES = {
        'custom-map-modes': { name: 'Custom Map Modes', price: 29.99 },
        'complete-iarc-setup': { name: 'Complete IARC Setup', price: 14.99 },
        'custom-thumbnails': { name: 'Custom Thumbnails', price: 19.99 },
        'yt-subs': { name: 'YouTube 1,000 Organic Subs', price: 49.99 },
        'yt-hours': { name: 'YouTube 4,000 Watch Hours', price: 99.99 },
        'yt-views': { name: 'YouTube 10,000 Views', price: 29.99 },
        'tk-followers': { name: 'TikTok 5,000 Followers', price: 49.99 },
        'tk-likes': { name: 'TikTok 25,000 Likes', price: 24.99 },
        'tk-views': { name: 'TikTok 50,000 Views', price: 29.99 },
        'cross-platform': { name: 'Ultimate Cross-Platform Suite', price: 149.99 }
    };

    var WA_NUMBER = '97470340075';
    var EMAIL = 'bhattiabdulrehman430@gmail.com';

    function initEstimator() {
        var serviceEl = document.getElementById('estimator-service');
        var qtyEl = document.getElementById('estimator-qty');
        var speedEl = document.getElementById('estimator-speed');
        var displayEl = document.getElementById('estimator-price-display');
        if (!serviceEl || !qtyEl || !speedEl || !displayEl) return;

        function update() {
            var base = parseFloat(serviceEl.value) || 0;
            var qty = parseInt(qtyEl.value, 10) || 1;
            var speed = parseFloat(speedEl.value) || 1;
            displayEl.textContent = '$' + (base * qty * speed).toFixed(2);
        }

        serviceEl.addEventListener('change', update);
        qtyEl.addEventListener('input', update);
        speedEl.addEventListener('change', update);
        update();

        var orderBtn = document.getElementById('estimator-order');
        if (orderBtn) {
            orderBtn.addEventListener('click', function () {
                var base = parseFloat(serviceEl.value) || 0;
                var qty = parseInt(qtyEl.value, 10) || 1;
                var speed = parseFloat(speedEl.value) || 1;
                var total = (base * qty * speed).toFixed(2);
                var label = serviceEl.options[serviceEl.selectedIndex].text;
                var clean = label.replace(/\s*\(\$[\d.]+\)\s*$/, '');
                if (qty > 1) clean += ' x' + qty;
                openOrder('Estimate order — ' + clean + ' — $' + total, total);
            });
        }
    }

    function compileOrderSheet(description, total) {
        var lines = [];
        lines.push('FURY AGENCY Order Inquiry');
        lines.push('');
        lines.push('Item: ' + description);
        if (total) lines.push('Estimated Total: $' + total);
        lines.push('');
        lines.push('Please confirm pricing and availability.');
        return lines.join('\n');
    }

    function openOrder(description, total) {
        var sheet = compileOrderSheet(description, total);
        return {
            description: description,
            total: total,
            sheet: sheet
        };
    }

    /* Direct order buttons: data-order attr = product id */
    function initOrderButtons() {
        document.querySelectorAll('[data-order]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-order');
                var product = SERVICE_PRICES[id];
                if (!product) return;
                window.open(
                    'https://wa.me/' + WA_NUMBER +
                    '?text=' + encodeURIComponent(compileOrderSheet(product.name + ' — $' + product.price.toFixed(2), product.price.toFixed(2))),
                    '_blank'
                );
            });
        });

        var paypalBtn = document.getElementById('payPalButton');
        if (paypalBtn) {
            paypalBtn.addEventListener('click', function () {
                var productId = paypalBtn.getAttribute('data-order');
                var product = productId ? SERVICE_PRICES[productId] : null;
                if (!product) return;
                var url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick' +
                    '&business=' + encodeURIComponent(EMAIL) +
                    '&item_name=' + encodeURIComponent(product.name) +
                    '&amount=' + product.price.toFixed(2) +
                    '&currency_code=USD';
                window.location.href = url;
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        initEstimator();
        initOrderButtons();
    });
})();