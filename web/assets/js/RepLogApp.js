'use strict';

(function (window, $) {

    window.RepLogApp = {

        initialize: function($wrapper) {
            this.$wrapper = $wrapper;

            // Helper.initialize($wrapper);
            this.helper = new Helper($wrapper);

            var helper2 = new Helper($('footer'));

            console.log(
                this.helper.calculateTotalWeight(),
                helper2.calculateTotalWeight()
            );

            // console.log(
            //     'foo'.__proto__,
            //     [].__proto__,
            //     (new Date()).__proto__
            // );

            this.$wrapper.find('.js-delete-rep-log').on(
                'click',
                this.handleRepLogDelete.bind(this)
            );

            this.$wrapper.find('tbody tr').on(
                'click',
                this.handleRowClick.bind(this)
            );

        },

        // whatIsThis: function(greeting) {
        //   console.log(this, greeting);
        // },

        updateTotalWeightLifted: function() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },


        handleRepLogDelete: function(e) {
            e.preventDefault();

            var $link = $(e.currentTarget);
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            // var $totalWeightContainer = RepLogApp.$wrapper.find('.js-total-weight');
            // var newWeight = $totalWeightContainer.html() - $row.data('weight');
            var self = this;

            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function() {
                    $row.fadeOut('normal', function () {
                        // $row.remove();
                        $(this).remove();
                        self.updateTotalWeightLifted();
                    });
                    // $totalWeightContainer.html(newWeight);
                }
            })
        },

        handleRowClick: function() {
            console.log('row clicked');
        }

        // _calculateTotalWeight: function () {
        //     var totalWeight = 0;
        //
        //     this.$wrapper.find('tbody tr').each(function() {
        //         totalWeight += $(this).data('weight');
        //     });
        //
        //     return  totalWeight;
        // }
    };


    /**
     * A "private" object
     */
    var Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            var totalWeight = 0;

            this.$wrapper.find('tbody tr').each(function() {
                totalWeight += $(this).data('weight');
            });

            return  totalWeight;
        }
    });

    // Helper.prototype.calculateTotalWeight = function () {
    //     var totalWeight = 0;
    //
    //     this.$wrapper.find('tbody tr').each(function() {
    //         totalWeight += $(this).data('weight');
    //     });
    //
    //     return  totalWeight;
    // };

})(window, jQuery);