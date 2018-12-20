(function($) {
    $.fn.extend({
        autofill: function(data, options) {
            var settings = {
                findbyname: true
            }

            if (options) {
                $.extend(settings, options);
            }

            var $input = $('input');
            var $textarea = $('textarea');

            $.each($input, function(index, item) {
                if (item.type === 'text') {
                    $(item).val(~~(Math.random() * 100000));
                }
                if (item.type === 'checkbox' || item.type === 'radio') {
                    $(item).prop('checked', true);
                }
            });

            $.each($textarea, function(index, item) {
                $(item).val(~~(Math.random() * 100000));
            });

            if (data) {
                
                $.each(data, function(k, v) {

                    // switch case findbyname / findbyid

                    var selector, elt;

                    if (settings.findbyname) { // by name
                        selector = '[name="' + k + '"]';
                        elt = $(selector);

                        if (elt.length == 1) {
                            elt.val((elt.attr("type") == "checkbox") ? [v] : v);
                        } else if (elt.length > 1) {
                            // radio
                            elt.val([v]);
                        } else {
                            selector = '[name="' + k + '[]"]';
                            elt = $(selector);
                            elt.each(function() {
                                $(this).val(v);
                            });
                        }
                    } else { // by id
                        selector = '#' + k;
                        elt = $(selector);

                        if (elt.length == 1) {
                            elt.val((elt.attr("type") == "checkbox") ? [v] : v);
                        } else {
                            var radiofound = false;

                            // radio
                            elt = $('input:radio[name="' + k + '"]');
                            elt.each(function() {
                                radiofound = true;
                                if (this.value == v) { this.checked = true; }
                            });
                            // multi checkbox
                            if (!radiofound) {
                                elt = $('input:checkbox[name="' + k + '[]"]');
                                elt.each(function() {
                                    $(this).val(v);
                                });
                            }
                        }
                    }
                });
            }


        }
    })
})(jQuery);