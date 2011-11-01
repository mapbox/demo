$(window).load(function() {
  $('textarea.js-snippet').each(function(a, b, elem) {
      CodeMirror.fromTextArea(a, {
              readOnly: 'nocursor',
              mode: {name:'javascript'},
              lineNumbers: true,
              value: elem.text()
          }
      );
  });
  $('textarea.python-snippet').each(function(a, b, elem) {
      CodeMirror.fromTextArea(a, {
              readOnly: 'nocursor',
              mode: {name:'python'},
              lineNumbers: true,
              value: elem.text()
          }
      );
  });
  $('textarea.carto-snippet').each(function(a, b, elem) {
      CodeMirror.fromTextArea(a, {
              readOnly: 'nocursor',
              mode: {name:'carto', reference: ref},
              lineNumbers: true,
              value: elem.text()
          }
      );
  });
  $('textarea.html-snippet').each(function(a, b, elem) {
      CodeMirror.fromTextArea(a, {
              readOnly: 'nocursor',
              mode: {name:'htmlmixed'},
              lineNumbers: true,
              value: elem.text()
          }
      );
  });
  $('#open-chat').click(
    function() {
      $('#chat').toggle();
  });
});
