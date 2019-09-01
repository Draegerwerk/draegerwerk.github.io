// IE does not offer String.endsWith()
// https://stackoverflow.com/a/2548133
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

// Update embed tag with given source
function update_pdf_modal(title, pdf_src) {
    $("#modal_title").text(title);
    $("#pdf_direct_download").attr("href", pdf_src);
    $("#pdf_direct_download").text(pdf_src);

    // IE / Edge need a new element to register that the src changed
    var pdf = $("#modal_previewer_embed").clone();
    pdf.attr("src", pdf_src);
    $("#modal_previewer_embed").replaceWith(pdf);
}

// jsTree initialization & data loading
$.getJSON("products.json", function(json) {
    $("document").ready($(function () {
        $("#product_tree").jstree(
            { "core": {"data" : json}, "plugins": [ "search" ]}
        );
        $("#product_tree").bind("select_node.jstree", function (e, data) {
            var href = data.node.a_attr.href;
            if (href === "#") {
                // Ignore empty links
                return;
            }
            if (href.toLowerCase().endsWith("pdf")) {
                // Render PDF in modal prompt
                update_pdf_modal(data.node.text + " Open Source Licenses", href);

                $("#iframe_modal").modal("toggle");
                return;
            }

            // Follow all other sorts of links
            document.location.href = href;
        });
        $("#product_tree_search").on("input", function() {
            $("#product_tree").jstree("search", $("#product_tree_search").val());
        });
    }));
});