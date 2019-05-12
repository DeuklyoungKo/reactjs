'use strict';

(function (window, $, swal) {


    // let HelperInstance = null;
    // let HelperInstances = new WeakMap();
    let HelperInstances = new Map();

    class RepLogApp {

        constructor($wrapper) {

            this.$wrapper = $wrapper;
            // this.helper = new Helper($wrapper);
            // this.HelperInstance = new Helper(this.$wrapper);
            // HelperInstance = new Helper(this.$wrapper);
            HelperInstances.set(this, new Helper(this.$wrapper));
            // return;

            this.loadRepLogs();

            // this.$wrapper.find('.js-delete-rep-log').on(
            this.$wrapper.on(
                'click',
                '.js-delete-rep-log',
                this.handleRepLogDelete.bind(this)
            )

            // this.$wrapper.find('tbody tr').on(
            this.$wrapper.on(
                'click',
                'tbody tr',
                this.handleRowClick.bind(this)
            )

            // this.$wrapper.find('.js-new-rep-log-form').on(
            this.$wrapper.on(
                'submit',
                RepLogApp._selectors.newRepForm,
                this.handleNewFormSubmit.bind(this)
            )
        }

        /**
         * Call like this.selectors
         */
        static get _selectors() {
            return {
                newRepForm: '.js-new-rep-log-form'
            }
        }

        static get _url() {
            return {
                rep_log_list: '/reps',
                rep_log_new: '/reps',
            }
        }


        loadRepLogs() {
            $.ajax({
                url: RepLogApp._url.rep_log_list,
            }).then(data => {
                // $.each(data.items, (key, repLog) => {
                // console.log(data);
                for (let repLog of data.items) {
                    // console.log(repLog);
                    this._addRow(repLog);
                }
            });
        }


        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                // HelperInstance.getTotalWeightString()
                HelperInstances.get(this).getTotalWeightString()

            );
        }


        handleRepLogDelete(e) {
            e.preventDefault();

            const $link = $(e.currentTarget);
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
        }

        _deleteRepLog($link) {

            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            const deleteUrl = $link.data('url');
            const $row = $link.closest('tr');
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
        }

        handleRowClick() {
            console.log('row clicked');
        }

        handleNewFormSubmit(e) {
            e.preventDefault();

            const $form = $(e.currentTarget);
            const formData = {};

            // $.each($form.serializeArray(), (key, fieldData) => {
            for (let fieldData in $form.serializeArray()) {
                formData[fieldData.name] = fieldData.value;
            }

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
        }

        _saveRepLog(data) {

            // var self = this;

            return new Promise((resolve,reject) => {

                const url = RepLogApp._url.rep_log_new;

                $.ajax({
                    url,
                    method: 'POST',
                    data: JSON.stringify(data)
                }).then( (data, textStatus, jqXHR) => {
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location'),
                    }).then((data) => {
                        resolve(data);
                    });
                }).catch(jqXHR => {
                    const errorData = JSON.parse(jqXHR.responseText);
                    reject(errorData);
                });
            });
        }

        _mapErrorsToForm(errorData) {
            // reset things
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            this._removeFormErrors();

            // console.log(errorData);

            // $form.find(':input').each( (index, element) => {
            for (let element in $form.find(':input')) {
                const fieldName = $(element).attr('name');
                const $wrapper = $(element).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    return;
                }

                const $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);

                // console.log($error);
                // console.log($error[0].outerText);

                $wrapper.append($error);
                $wrapper.addClass('has-error');
            }
        }

        _removeFormErrors() {
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        }

        _clearForm() {
            this._removeFormErrors();
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form[0].reset();
        }

        _addRow(repLog) {
            let {itemLabel, reps, id, totallyMadeUpKey = 'whatever!'} = repLog;
            // console.log(id, itemLabel, reps, totallyMadeUpKey);
            // const tplText = $('#js-rep-log-row-template').html();
            // const tplText = rowTemplate;
            // const tpl = _.template(tplText);
            const html = rowTemplate(repLog);
            this.$wrapper.find('tbody').append($.parseHTML(html));
            this.updateTotalWeightLifted();
        }

    }

    /**
     * A "private" object
     */
    class Helper {

        constructor($wrapper) {
            this.$wrapper = $wrapper;
        }

        calculateTotalWeight() {
            return Helper._calculateWeights(
                this.$wrapper.find('tbody tr')
            );
        }

        getTotalWeightString(maxWeight = 500) {
            let weight = this.calculateTotalWeight();

            if (weight > maxWeight) {
                weight = maxWeight + '+';
            }

            return weight + ' lbs';
        }


        static _calculateWeights($elements) {
            let totalWeight = 0;

            // console.log($elements);
            // $elements.each((index, element) => {
            for (let element in $elements) {
                totalWeight += $(element).data('weight');
            }

            return  totalWeight;
        }

    }

    function upper(template, ...expressions) {

        // console.log(template);
        // console.log(...expressions);

        return template.reduce((accumulator, part, i) => {

            // console.log(accumulator);
            // console.log(part);
            // console.log(i);

            // console.log(expressions[i - 1].toUpperCase);

            return accumulator + (expressions[i - 1].toUpperCase ? expressions[i - 1].toUpperCase() : expressions[i - 1]) + part
        })
    }


    // const rowTemplate = (repLog) => upper`
    const rowTemplate = (repLog) => `
            <tr data-weight="${repLog.totalWeightLifted}">
                <td>${repLog.itemLabel}</td>
                <td>${repLog.reps}</td>
                <td>${repLog.totalWeightLifted}</td>
                <td>
                    <a href="#"
                        class="js-delete-rep-log"
                        data-url="${repLog.links._self}"
                    >
                        <span class="fa fa-trash"></span>
                    </a>
                </td>
            </tr>
        `;
/*

    new RepLogApp($('body'));
    new RepLogApp($('body'));
    new RepLogApp($('body'));
    new RepLogApp($('body'));

    setTimeout(() => {
        console.log(HelperInstances);
    }, 5000);
*/


    window.RepLogApp = RepLogApp;
})(window, jQuery, swal);