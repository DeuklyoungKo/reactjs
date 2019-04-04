'use strict';

(function (window, $) {

    window.RepLogApp = function($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        // this.$wrapper.find('.js-delete-rep-log').on(
        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        // this.$wrapper.find('tbody tr').on(
        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        // this.$wrapper.find('.js-new-rep-log-form').on(
        this.$wrapper.on(
            'submit',
            this._selectors.newRepForm,
            this.handleNewFormSubmit.bind(this)
        )


    };

    $.extend(window.RepLogApp.prototype, {

        _selectors: {
            newRepForm: '.js-new-rep-log-form'
        },

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
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();

            var $form = $(e.currentTarget);
            var formData = {};
            $.each($form.serializeArray(), function (key, fieldData) {
                formData[fieldData.name] = fieldData.value;
            });

            var self = this;

            $.ajax({
                url: $form.data('url'),
                method: 'POST',
                data: JSON.stringify(formData),
                success: function (data) {
                    // todo
                    console.log('success!');
                },
                error: function (jqXHR) {
                    var errorData = JSON.parse(jqXHR.responseText);
                    self._mapErrorsToForm(errorData.errors);
                }
            })
        },

        _mapErrorsToForm: function (errorData) {
            // reset things
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
            // console.log(errorData);

            $form.find(':input').each(function () {
                var fieldName = $(this).attr('name');
                var $wrapper = $(this).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    return;
                }

                var $error = $('<span class="js-field-error help-block"></span>');


                $error.html(errorData[fieldName]);

                console.log($error);
                console.log($error[0].outerText);

                $wrapper.append($error);
                $wrapper.addClass('has-error');
            });
        }

    });


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