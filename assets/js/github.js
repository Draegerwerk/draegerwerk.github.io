var ghorg_url = "https://api.github.com/orgs/Draegerwerk/repos";

// Format numbers >=1000 with k: https://stackoverflow.com/a/9461657
function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num);
}

// Fill repo box template on page load with data from GH
$(document).ready(function() {
    $.getJSON(ghorg_url, function(gh_data) {
        // Populate HTML5 <template>
        gh_data.forEach(function(repo, index) {
            var t = $("#project_list_template")[0].content;

            // Automatically enable first item
            if (index === 0) {
                $(t).find(".carousel-item").addClass("active");
            } else {
                $(t).find(".carousel-item").removeClass("active");
            }

            // Make sure that links start with https to avoid javascript: XSS
            if (repo.html_url.indexOf("https") != 0) {
                repo.html_url = "https://" + repo.html_url;
            }

            // Set variables from GH REST API
            $(t).find(".repo_name").text(repo.name);
            $(t).find(".repo_url").attr("href", repo.html_url);
            $(t).find(".repo_num_forks").text(kFormatter(repo.forks));
            $(t).find(".repo_num_stars").text(kFormatter(repo.stargazers_count));
            $(t).find(".repo_num_watchers").text(kFormatter(repo.watchers_count));
            $(t).find(".repo_desc").text(repo.description);
            $("#project_list").append($(t).clone()).html();

            // Also add new li for carousel indicator from template
            var t = $("#carousel_indicator_template")[0].content;
            // Automatically enable first item
            if (index === 0) {
                $(t).find(".indicator_list_item").addClass("active");
            } else {
                $(t).find(".indicator_list_item").removeClass("active");
            }
            $(t).find(".indicator_list_item").attr("data-slide-to", index);
            $(".carousel-indicators").append($(t).clone()).html();

            // Show carousel and hide "Nothing here, yet.." message
            $("#github_nothinghere").hide();
            $("#carousel_indicator").show();
        });
    });
});