/*
 * jQuery Accessible Accordion system, using ARIA
 * Website: https://a11y.nicolas-hoffmann.net/accordion/
 * License MIT: https://github.com/nico3333fr/jquery-accessible-accordion-aria/blob/master/LICENSE
 */
(function ($) {
  'use strict';

  var defaultConfig = {
    headersSelector: '.js-accordion__header',
    panelsSelector: '.js-accordion__panel',
    buttonsSelector: 'button.js-accordion__header',
    button: $('<button></button>', {
      class: 'js-accordion__header',
      type: 'button'
    }),
    buttonSuffixId: '_tab',
    multiselectable: true,
    prefixClass: 'accordion',
    headerSuffixClass: '__title',
    buttonSuffixClass: '__header',
    panelSuffixClass: '__panel',
    direction: 'ltr'
  };

  var Accordion = function ($el, options) {
    this.options = $.extend({}, defaultConfig, options);

    this.$wrapper = $el;
    this.$panels = $(this.options.panelsSelector, this.$wrapper);

    this.initAttributes();
    this.initEvents();
  };

  Accordion.prototype.initAttributes = function () {
    this.$wrapper.attr({
      'role': 'tablist',
      'aria-multiselectable': this.options.multiselectable.toString()
    }).addClass(this.options.prefixClass);

    this.$panels.each($.proxy(function (index, el) {
      var $panel = $(el);
      var $header = $(this.options.headersSelector, $panel);
      var $button = this.options.button.clone().text($header.text());

      $header.attr('tabindex', '0').addClass(this.options.prefixClass + this.options.headerSuffixClass);
      $panel.before($button);

      var panelId = $panel.attr('id') || this.$wrapper.attr('id') + '-' + index;
      var buttonId = panelId + this.options.buttonSuffixId;

      $button.attr({
        'aria-controls': panelId,
        'aria-expanded': 'false',
        'role': 'tab',
        'id': buttonId,
        'tabindex': '-1',
        'aria-selected': 'false'
      }).addClass(this.options.prefixClass + this.options.buttonSuffixClass);

      $panel.attr({
        'aria-labelledby': buttonId,
        'role': 'tabpanel',
        'id': panelId,
        'aria-hidden': 'true'
      }).addClass(this.options.prefixClass + this.options.panelSuffixClass);

      // if opened by default
      if ($panel.attr('data-accordion-opened') === 'true') {
        $button.attr({
          'aria-expanded': 'true',
          'data-accordion-opened': null
        });

        $panel.attr({
          'aria-hidden': 'false'
        });
      }

      // init first one focusable
      if (index === 0) {
        $button.removeAttr('tabindex');
      }
    }, this));

    this.$buttons = $(this.options.buttonsSelector, this.$wrapper);
  };

  Accordion.prototype.initEvents = function () {
    this.$wrapper.on('focus', this.options.buttonsSelector, $.proxy(this.focusButtonEventHandler, this));

    this.$wrapper.on('click', this.options.buttonsSelector, $.proxy(this.clickButtonEventHandler, this));

    this.$wrapper.on('keydown', this.options.buttonsSelector, $.proxy(this.keydownButtonEventHandler, this));

    this.$wrapper.on('keydown', this.options.panelSelector, $.proxy(this.keydownPanelEventHandler, this));
  };

  Accordion.prototype.focusButtonEventHandler = function (e) {
    var $button = $(e.target);

    $(this.options.buttonsSelector, this.$wrapper).attr({
      'tabindex': '-1',
      'aria-selected': 'false'
    });

    $button.attr({
      'aria-selected': 'true',
      'tabindex': null
    });
  };

  Accordion.prototype.clickButtonEventHandler = function (e) {
    var $button = $(e.target);
    var $panel = $('#' + $button.attr('aria-controls'));

    this.$buttons.attr('aria-selected', 'false');
    $button.attr('aria-selected', 'true');

    // opened or closed?
    if ($button.attr('aria-expanded') === 'false') { // closed
      $button.attr('aria-expanded', 'true');
      $panel.attr('aria-hidden', 'false');
    }
    else { // opened
      $button.attr('aria-expanded', 'false');
      $panel.attr('aria-hidden', 'true');
    }

    if (this.options.multiselectable === false) {
      this.$panels.not($panel).attr( 'aria-hidden', 'true');
      this.$buttons.not($button).attr('aria-expanded', 'false');
    }

    setTimeout(function () {
      $button.focus();
    }, 0);

    e.preventDefault();
  };

  Accordion.prototype.keydownButtonEventHandler = function (e) {
    var $button = $(e.target);
    var $firstButton = this.$buttons.first();
    var $lastButton = this.$buttons.last();
    var $prevButton = $button.prevAll(this.options.buttonsSelector).first();
    var $nextButton = $button.nextAll(this.options.buttonsSelector).first();
    var $target = null;

    var k = this.options.direction === 'ltr' ? {
      prev: [38, 37], // up & left
      next: [40, 39], // down & right
      first: 36, // home
      last: 35 // end
    } : {
      prev: [38, 39], // up & left
      next: [40, 37], // down & right
      first: 36, // home
      last: 35 // end
    };

    var allKeyCode = [].concat(k.prev, k.next, k.first, k.last);

    if ($.inArray(e.keyCode, allKeyCode) >= 0 && !e.ctrlKey) {
      this.$buttons.attr({
        'tabindex': '-1',
        'aria-selected': 'false'
      });


      if (e.keyCode === 36) {
        $target = $firstButton;
      }
      // strike end in the tab => last tab
      else if (e.keyCode === 35) {
        $target = $lastButton;
      }
      // strike up or left in the tab => previous tab
      else if ($.inArray(e.keyCode, k.prev) >= 0) {
        // if we are on first one, activate last
        $target = $button.is($firstButton) ? $lastButton : $prevButton;
      }
      // strike down or right in the tab => next tab
      else if ($.inArray(e.keyCode, k.next) >= 0) {
        // if we are on last one, activate first
        $target = $button.is($lastButton) ? $firstButton : $nextButton;
      }

      if ($target !== null) {
        this.goToHeader($target);
      }

      e.preventDefault();
    }
  };

  Accordion.prototype.keydownPanelEventHandler = function (e) {
    var $panel = $(e.target);
    var $button = $('#' + $panel.attr('aria-labelledby'));
    var $firstButton = this.$wrapper.find(this.options.buttonsSelector).first();
    var $lastButton = this.$wrapper.find(this.options.buttonsSelector).last();
    var $prevButton = $button.prevAll(this.options.buttonsSelector).first();
    var $nextButton = $button.nextAll(this.options.buttonsSelector).first();
    var $target = null;

    // strike up + ctrl => go to header
    if ( e.keyCode === 38 && e.ctrlKey ) {
      $target = $button;
    }
    // strike pageup + ctrl => go to prev header
    else if ( e.keyCode === 33 && e.ctrlKey ) {
      $target = $button.is($firstButton) ? $lastButton : $prevButton;
    }
    // strike pagedown + ctrl => go to next header
    else if ( e.keyCode === 34 && e.ctrlKey ) {
      $target = $button.is($lastButton) ? $firstButton : $nextButton;
    }

    if ($target !== null) {
      this.goToHeader($target);
    }
  };

  Accordion.prototype.goToHeader = function ($target) {
    if ($target.length !== 1) {
      return;
    }

    $target.attr({
      'aria-selected': 'true',
      'tabindex': null
    });

    setTimeout(function () {
      $target.focus();
    }, 0);
  };


  var PLUGIN = 'accordion';

  $.fn[PLUGIN] = function (params) {
    var options = $.extend({}, $.fn[PLUGIN].defaults, params);


    return this.each(function () {
      var $el = $(this);

      var specificOptions = {
        multiselectable: $el.attr('data-accordion-multiselectable') === 'true' ? true : options.multiselectable,
        prefixClass: typeof($el.attr('data-accordion-prefix-classes')) !== 'undefined' ? $el.attr('data-accordion-prefix-classes') : options.prefixClass,
        direction: $el.closest('[dir="rtl"]').length > 0 ? 'rtl' : options.direction
      };
      specificOptions = $.extend({}, options, specificOptions);

      $el.data[PLUGIN] = new Accordion($el, specificOptions);
    });
  };

  $.fn[PLUGIN].defaults = defaultConfig;

})(window.jQuery);
