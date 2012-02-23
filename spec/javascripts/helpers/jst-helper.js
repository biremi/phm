var JST = [];
JST["spec/test_widget"] = function (locals) {
    function html_escape(text) {
        return (text + "").
            replace(/&/g, "&amp;").
            replace(/</g, "&lt;").
            replace(/>/g, "&gt;").
            replace(/\"/g, "&quot;");
    }
    with(locals || {}) {
        try {
            var _$output="<div id=\"" + html_escape(elementId) + "\" class=\"ui-label\">" + "<span data-jsclass=\"child-widget\"></span></div>";
            return _$output;
        } catch (e) {
            return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
        }
    }
};
JST["spec/test_widget_library"] = function (locals) {
    function html_escape(text) {
        return (text + "").
            replace(/&/g, "&amp;").
            replace(/</g, "&lt;").
            replace(/>/g, "&gt;").
            replace(/\"/g, "&quot;");
    }
    with(locals || {}) {
        try {
            var _$output="<div id=\"" + html_escape(elementId) + "\" class=\"ui-label\">" + 
                "<uilibrary type=\"button\" name=\"button\" text=\"Button\" class=\"test-class\"></uilibrary></div>";
            return _$output;  } catch (e) {
                return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
            }
    }
};
JST["library/button"] = function (locals) {
    function html_escape(text) {
        return (text + "").
            replace(/&/g, "&amp;").
            replace(/</g, "&lt;").
            replace(/>/g, "&gt;").
            replace(/\"/g, "&quot;");
    }
    with(locals || {}) {
        try {
            var _$output="<div id=\"" + html_escape(elementId) + "\" class=\"button\">" + 
                "<span data-jsclass=\"" + html_escape('text') + "\" class=\"text\">" + 
                html_escape(text) + 
                "</span></div>";
            return _$output;  } catch (e) {
                return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
            }
    }
}
