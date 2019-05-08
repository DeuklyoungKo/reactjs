'use strict';

(function (window, $, swal) {

    window.RepLogApp = function($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        this.loadRepLogs();

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

        _url: {
            rep_log_list: '/reps',
            rep_log_new: '/reps',
        },

        loadRepLogs: function() {
            // var self = this;
            $.ajax({
                url: this._url.rep_log_list,
            }).then(data => {
                // console.log(this,self);
                $.each(data.items, (key, repLog) => {
                    this._addRow(repLog);
                });
            });
        },


        updateTotalWeightLifted: function() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },


        handleRepLogDelete: function(e) {
            e.preventDefault();

            var $link = $(e.currentTarget);
            // var self = this;
            Swal.fire({
                title: 'Delete this log?',
                text: "What? Did you not actually left this?",
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: () => this._deleteRepLog($link),
            }).then(result => {
                if (result.value) {
                    // self._deleteRepLog($link);
                }else if (
                    // Read more about handling dismissals
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    console.log("canceled");
                }
            }).catch(function (arg) {
                console.log('canceled', arg);
            });
        },

        _deleteRepLog: function($link) {

            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            // var self = this;

            return $.ajax({
                url: deleteUrl,
                method: 'DELETE',
            }).then(() => {
                $row.fadeOut('normal', () => {
                    // $(this).remove();
                    $row.remove();
                    // self.updateTotalWeightLifted();
                    this.updateTotalWeightLifted();
                });
            });
        },

        handleRowClick: function() {
            console.log('row clicked');
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();

            var $form = $(e.currentTarget);
            var formData = {};
            $.each($form.serializeArray(), (key, fieldData) => {
                formData[fieldData.name] = fieldData.value;
            });

            // var self = this;

            this._saveRepLog(formData)
            .then(data => {
                // self._clearForm();
                // self._addRow(data)
                this._clearForm();
                this._addRow(data);
            }).catch(errorData => {
                // self._mapErrorsToForm(errorData.errors);
                this._mapErrorsToForm(errorData.errors);
            });
        },

        _saveRepLog: function(data) {


            // var self = this;

            return new Promise((resolve,reject) => {

                $.ajax({
                    url: this._url.rep_log_new,
                    method: 'POST',
                    data: JSON.stringify(data)
                }).then( (data, textStatus, jqXHR) => {
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location'),
                    }).then((data) => {
                        resolve(data);
                    });
                }).catch(jqXHR => {
                    var errorData = JSON.parse(jqXHR.responseText);
                    reject(errorData);
                });
            });
        },

        _mapErrorsToForm: function (errorData) {
            // reset things
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            this._removeFormErrors();

            // console.log(errorData);

            $form.find(':input').each( (index, element) => {
                // var fieldName = $(this).attr('name');
                // var $wrapper = $(this).closest('.form-group');
                var fieldName = $(element).attr('name');
                var $wrapper = $(element).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    return;
                }

                var $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);

                // console.log($error);
                // console.log($error[0].outerText);

                $wrapper.append($error);
                $wrapper.addClass('has-error');
            });
        },

        _removeFormErrors: function () {
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        },

        _clearForm: function() {
            this._removeFormErrors();

            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form[0].reset();
        },

        _addRow: function (repLog) {
            // console.log(repLog);
            var tplText = $('#js-rep-log-row-template').html();
            var tpl = _.template(tplText);

            var html = tpl(repLog);
            this.$wrapper.find('tbody')
                // .append($.parseHTML(html));
                .append(html);
            this.updateTotalWeightLifted();
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

            this.$wrapper.find('tbody tr').each((index, element) => {
                // totalWeight += $(this).data('weight');
                totalWeight += $(element).data('weight');
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

})(window, jQuery, swal);