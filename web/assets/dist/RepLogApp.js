'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function (window, $, swal) {
  var HelperInstances = new Map();

  var RepLogApp =
  /*#__PURE__*/
  function () {
    function RepLogApp($wrapper) {
      _classCallCheck(this, RepLogApp);

      this.$wrapper = $wrapper;
      this.repLogs = [];
      HelperInstances.set(this, new Helper(this.repLogs));
      this.loadRepLogs();
      this.$wrapper.on('click', '.js-delete-rep-log', this.handleRepLogDelete.bind(this)); // this.$wrapper.find('tbody tr').on(

      this.$wrapper.on('click', 'tbody tr', this.handleRowClick.bind(this)); // this.$wrapper.find('.js-new-rep-log-form').on(

      this.$wrapper.on('submit', RepLogApp._selectors.newRepForm, this.handleNewFormSubmit.bind(this));
    }
    /**
     * Call like this.selectors
     */


    _createClass(RepLogApp, [{
      key: "loadRepLogs",
      value: function loadRepLogs() {
        var _this = this;

        $.ajax({
          url: RepLogApp._url.rep_log_list
        }).then(function (data) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var repLog = _step.value;

              _this._addRow(repLog);
            } // console.log(this.repLogs, this.repLogs.includes(data.items[0]));

          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });
      }
    }, {
      key: "updateTotalWeightLifted",
      value: function updateTotalWeightLifted() {
        this.$wrapper.find('.js-total-weight').html( // HelperInstance.getTotalWeightString()
        HelperInstances.get(this).getTotalWeightString());
      }
    }, {
      key: "handleRepLogDelete",
      value: function handleRepLogDelete(e) {
        var _this2 = this;

        e.preventDefault();
        var $link = $(e.currentTarget); // var self = this;

        Swal.fire({
          title: 'Delete this log?',
          text: "What? Did you not actually left this?",
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: function preConfirm() {
            return _this2._deleteRepLog($link);
          }
        }).then(function (result) {
          if (result.value) {// self._deleteRepLog($link);
          } else if ( // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel) {
            console.log("canceled");
          }
        })["catch"](function (arg) {
          console.log('canceled', arg);
        });
      }
    }, {
      key: "_deleteRepLog",
      value: function _deleteRepLog($link) {
        var _this3 = this;

        $link.addClass('text-danger');
        $link.find('.fa').removeClass('fa-trash').addClass('fa-spinner').addClass('fa-spin');
        var deleteUrl = $link.data('url');
        var $row = $link.closest('tr'); // var self = this;

        return $.ajax({
          url: deleteUrl,
          method: 'DELETE'
        }).then(function () {
          $row.fadeOut('normal', function () {
            // we need to remove the repLog from this.repLogs
            // the "key" is the index to this repLog on this.repLogs
            _this3.repLogs.splice($row.data('key'), 1);

            $row.remove();
            console.log(_this3.repLogs); // this.repLogs.remove()

            _this3.updateTotalWeightLifted();
          });
        });
      }
    }, {
      key: "handleRowClick",
      value: function handleRowClick() {
        console.log('row clicked');
      }
    }, {
      key: "handleNewFormSubmit",
      value: function handleNewFormSubmit(e) {
        var _this4 = this;

        e.preventDefault();
        var $form = $(e.currentTarget);
        var formData = {}; // console.log($form.serializeArray());
        // $.each($form.serializeArray(), (key, fieldData) => {

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = $form.serializeArray()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var fieldData = _step2.value;
            // console.log(fieldData, fieldData.name,  fieldData.value);
            formData[fieldData.name] = fieldData.value;
          } // var self = this;

        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this._saveRepLog(formData).then(function (data) {
          // self._clearForm();
          // self._addRow(data)
          _this4._clearForm();

          _this4._addRow(data);
        })["catch"](function (errorData) {
          // self._mapErrorsToForm(errorData.errors);
          _this4._mapErrorsToForm(errorData.errors);
        });
      }
    }, {
      key: "_saveRepLog",
      value: function _saveRepLog(data) {
        // var self = this;
        return new Promise(function (resolve, reject) {
          var url = RepLogApp._url.rep_log_new;
          $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(data)
          }).then(function (data, textStatus, jqXHR) {
            $.ajax({
              url: jqXHR.getResponseHeader('Location')
            }).then(function (data) {
              resolve(data);
            });
          })["catch"](function (jqXHR) {
            var errorData = JSON.parse(jqXHR.responseText);
            reject(errorData);
          });
        });
      }
    }, {
      key: "_mapErrorsToForm",
      value: function _mapErrorsToForm(errorData) {
        // reset things
        var $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);

        this._removeFormErrors(); // console.log(errorData);
        // $form.find(':input').each( (index, element) => {


        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = $form.find(':input')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var element = _step3.value;
            var fieldName = $(element).attr('name');
            var $wrapper = $(element).closest('.form-group');

            if (!errorData[fieldName]) {
              // no error!
              return;
            }

            var $error = $('<span class="js-field-error help-block"></span>');
            $error.html(errorData[fieldName]); // console.log($error);
            // console.log($error[0].outerText);

            $wrapper.append($error);
            $wrapper.addClass('has-error');
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: "_removeFormErrors",
      value: function _removeFormErrors() {
        var $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form.find('.js-field-error').remove();
        $form.find('.form-group').removeClass('has-error');
      }
    }, {
      key: "_clearForm",
      value: function _clearForm() {
        this._removeFormErrors();

        var $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form[0].reset();
      }
    }, {
      key: "_addRow",
      value: function _addRow(repLog) {
        this.repLogs.push(repLog); // let {itemLabel, reps, id, totallyMadeUpKey = 'whatever!'} = repLog;

        var html = rowTemplate(repLog);
        var $row = $($.parseHTML(html));
        $row.data('key', this.repLogs.length - 1); // this.$wrapper.find('tbody').append($.parseHTML(html));

        this.$wrapper.find('tbody').append($row);
        this.updateTotalWeightLifted();
      }
    }], [{
      key: "_selectors",
      get: function get() {
        return {
          newRepForm: '.js-new-rep-log-form'
        };
      }
    }, {
      key: "_url",
      get: function get() {
        return {
          rep_log_list: '/reps',
          rep_log_new: '/reps'
        };
      }
    }]);

    return RepLogApp;
  }();
  /**
   * A "private" object
   */


  var Helper =
  /*#__PURE__*/
  function () {
    function Helper(repLogs) {
      _classCallCheck(this, Helper);

      this.repLogs = repLogs;
    }

    _createClass(Helper, [{
      key: "calculateTotalWeight",
      value: function calculateTotalWeight() {
        // console.log(this.repLogs)
        return Helper._calculateWeights(this.repLogs);
      }
    }, {
      key: "getTotalWeightString",
      value: function getTotalWeightString() {
        var maxWeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
        var weight = this.calculateTotalWeight();

        if (weight > maxWeight) {
          weight = maxWeight + '+';
        }

        return weight + ' lbs';
      }
    }], [{
      key: "_calculateWeights",
      value: function _calculateWeights(repLogs) {
        var totalWeight = 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = repLogs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var repLog = _step4.value;
            // console.log(repLog, repLog.totalWeightLifted);
            totalWeight += repLog.totalWeightLifted;
          }
          /*
                      console.log(repLogs);
                      for (let repLog in repLogs) {
                          // console.log(repLog, repLogs[repLog].totalWeightLifted);
                          totalWeight += repLogs[repLog].totalWeightLifted;
                      }
            */

        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return totalWeight;
      }
    }]);

    return Helper;
  }();

  function upper(template) {
    for (var _len = arguments.length, expressions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expressions[_key - 1] = arguments[_key];
    }

    return template.reduce(function (accumulator, part, i) {
      return accumulator + (expressions[i - 1].toUpperCase ? expressions[i - 1].toUpperCase() : expressions[i - 1]) + part;
    });
  } // const rowTemplate = (repLog) => upper`


  var rowTemplate = function rowTemplate(repLog) {
    return "\n            <tr data-weight=\"".concat(repLog.totalWeightLifted, "\">\n                <td>").concat(repLog.itemLabel, "</td>\n                <td>").concat(repLog.reps, "</td>\n                <td>").concat(repLog.totalWeightLifted, "</td>\n                <td>\n                    <a href=\"#\"\n                        class=\"js-delete-rep-log\"\n                        data-url=\"").concat(repLog.links._self, "\"\n                    >\n                        <span class=\"fa fa-trash\"></span>\n                    </a>\n                </td>\n            </tr>\n        ");
  };

  window.RepLogApp = RepLogApp;
})(window, jQuery, swal);
