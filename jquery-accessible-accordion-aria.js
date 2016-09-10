/*
 * jQuery Accessible Accordion system, using ARIA
 * Website: http://a11y.nicolas-hoffmann.net/accordion/
 * License MIT: https://github.com/nico3333fr/jquery-accessible-accordion-aria/blob/master/LICENSE
 */
(function ($) {
  $(function(){
    var $accordions = $('.js-accordion');

    function goToHeader($target) {
      if ($target.length !== 1 ) {
        return;
      }

      $target.attr({
        'aria-selected': 'true',
        'tabindex': null
      });

      setTimeout(function () {
        $target.focus();
      }, 0);
    }

    // init
    $accordions.each(function (index) {
      var $this = $(this);
      var $options = $this.data();
      var $accordions_headers = $this.children('.js-accordion__header');
      var $accordions_prefix_classes = $options.accordionPrefixClasses || '';
      var $accordions_multiselectable = $options.accordionMultiselectable || '';
      var $index_accordion = index + 1;

      $this.attr({
        'role': 'tablist',
        'aria-multiselectable': 'true',
        'class': $accordions_prefix_classes
      });

      // multiselectable or not
      if ($accordions_multiselectable === 'none') {
        $this.attr('aria-multiselectable', 'false' );
      }

      $accordions_headers.each(function (index_h) {
        var $that = $(this);
        var $text = $that.text();
        var $accordion_panel = $that.next( '.js-accordion__panel' );
        var $index_header = index_h + 1;
        var $accordion_header = $( '<button class="js-accordion__header ' + $accordions_prefix_classes + '__header">' + $text + '</button>');

        $accordion_panel.prepend($that.removeClass('js-accordion__header').addClass($accordions_prefix_classes + '__title').attr('tabindex', '0'));
        $accordion_panel.before($accordion_header);

        $accordion_header.attr({
          'aria-controls': 'accordion' + $index_accordion + '_panel' + $index_header,
          'aria-expanded': 'false',
          'role': 'tab',
          'id': 'accordion' + $index_accordion + '_tab' + $index_header,
          'tabindex': '-1',
          'aria-selected': 'false'
        });
        $accordion_panel.attr({
          'aria-labelledby': 'accordion' + $index_accordion + '_tab' + $index_header,
          'role': 'tabpanel',
          'id': 'accordion' + $index_accordion + '_panel' + $index_header,
          'aria-hidden': 'true'
        }).addClass( $accordions_prefix_classes + '__panel' );

        // if opened by default
        if ($that.attr('data-accordion-opened') === 'true') {
          $accordion_header.attr('aria-expanded', 'true').removeAttr('data-accordion-opened');
          $accordion_panel.attr('aria-hidden', 'false' );
        }

        // init first one focusable
        if ($index_header === 1) {
          $accordion_header.removeAttr('tabindex');
        }
      });
    });

    /* Events ---------------------------------------------------------------------------------------------------------- */
    /* click on a tab link */
    $(document).on('focus', '.js-accordion__header', function () {
      var $this = $(this);
      var $accordion = $this.parent();
      var $all_accordion_headers = $accordion.find('.js-accordion__header');

      // selected
      $all_accordion_headers.attr({
        'tabindex': '-1',
        'aria-selected': 'false'
      });

      $this.attr({
        'aria-selected': 'true',
        'tabindex': null
      });
    })
    .on('click', '.js-accordion__header', function (event) {
      var $this = $(this);
      var $this_panel = $('#' + $this.attr('aria-controls'));
      var $accordion = $this.parent();
      var $accordion_multiselectable = $accordion.attr('aria-multiselectable');
      var $all_accordion_headers = $accordion.find('.js-accordion__header');
      var $all_accordion_panels = $accordion.find('.js-accordion__panel');

      $all_accordion_headers.attr('aria-selected', 'false');
      $this.attr('aria-selected', 'true');

      // opened or closed?
      if ($this.attr('aria-expanded') === 'false') { // closed
        $this.attr('aria-expanded', 'true');
        $this_panel.attr('aria-hidden', 'false');
      }
      else { // opened
        $this.attr('aria-expanded', 'false');
        $this_panel.attr('aria-hidden', 'true');
      }

      if ($accordion_multiselectable === 'false') {
        $all_accordion_panels.not($this_panel).attr( 'aria-hidden', 'true');
        $all_accordion_headers.not($this).attr('aria-expanded', 'false');
      }

      setTimeout(function () {
        $this.focus();
      }, 0);
      event.preventDefault();
    })
    .on('keydown', '.js-accordion__header', function (event) {
      var $this = $( this );
      var $accordion = $this.parent();
      var $all_accordion_headers = $accordion.find('.js-accordion__header');
      var $first_header = $accordion.find('.js-accordion__header').first();
      var $last_header = $accordion.find('.js-accordion__header').last();
      var $prev_header = $this.prevAll('.js-accordion__header').first();
      var $next_header = $this.nextAll('.js-accordion__header').first();
      var $target = null;

      // strike up or left in the tab => previous tab
      if ((event.keyCode === 37 || event.keyCode === 38) && !event.ctrlKey) {
        $all_accordion_headers.attr({
          'tabindex': '-1',
          'aria-selected': 'false'
        });

        // if we are on first one, activate last
        $target = $this.is($first_header) ? $last_header : $prev_header;

        goToHeader($target);

        event.preventDefault();
      }
      // strike down or right in the tab => next tab
      else if ((event.keyCode === 40 || event.keyCode === 39) && !event.ctrlKey) {
        $all_accordion_headers.attr({
          'tabindex': '-1',
          'aria-selected': 'false'
        });
        // if we are on last one, activate first
        $target = $this.is($last_header) ? $first_header : $next_header;

        goToHeader($target);

        event.preventDefault();
      }
      else if ( $.inArray(event.keyCode, [35, 36])) {
        $all_accordion_headers.attr({
          'tabindex': '-1',
          'aria-selected': 'false'
        });

        // strike home in the tab => 1st tab
        if (event.keyCode === 36) {
          $target = $first_header;
        }
        // strike end in the tab => last tab
        else if (event.keyCode === 35) {
          $target = $last_header;
        }

        goToHeader($target);

        event.preventDefault();
      }
    })
    .on('keydown', '.js-accordion__panel', function (event) {
      var $this = $(this);
      var $this_header = $( '#' + $this.attr('aria-labelledby' ));
      var $accordion = $this.parent();
      var $first_header = $accordion.find('.js-accordion__header').first();
      var $prev_header = $this_header.prevAll('.js-accordion__header').first();
      var $next_header = $this_header.nextAll('.js-accordion__header').first();
      var $last_header = $accordion.find('.js-accordion__header').last();
      var $target = null;

      // strike up + ctrl => go to header
      if ( event.keyCode === 38 && event.ctrlKey ) {
        $target = $this_header;
      }
      // strike pageup + ctrl => go to prev header
      else if ( event.keyCode === 33 && event.ctrlKey ) {
        $target = $this_header.is($first_header) ? $last_header : $prev_header;
      }
      // strike pagedown + ctrl => go to next header
      else if ( event.keyCode === 34 && event.ctrlKey ) {
        $target = $this_header.is($last_header) ? $first_header : $next_header;
      }
      if ($target !== null) {
        goToHeader($target);
      }
    });
  });
})(window.jQuery);
