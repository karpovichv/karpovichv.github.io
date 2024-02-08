$(document).ready(function() {
    $("#content").hide();

    //TODO: if readme is 404
    $.when(
        $.ajax("https://api.github.com/users/karpovichv"),
        $.ajax("https://api.github.com/users/karpovichv/social_accounts"),
        $.ajax("https://raw.githubusercontent.com/karpovichv/karpovichv/main/README.md")
    ).done(function(userResponse, socialsResponse, readmeResponse) {
        setTitle(userResponse[0]);
        setProfileInfo(userResponse[0]);
        setLinks(userResponse[0], socialsResponse[0]);
        setReadme(readmeResponse[0]);

        $("#spinner").hide();
        $("#content").fadeIn("slow");
    }).fail(function() {
        alert("Something went wrong")
    });
});

const li_regexp = /\/in\/([^/]+)\/?/gm;

function getLink(text, icon, url) {
    return "<a class=\"link-opacity-50\" style=\"white-space:nowrap\" href=\"" + url + "\">" + "<i class=\"" + icon + "\"></i> " + text + "</a>";
}

function setTitle(userData) {
    $("#title").append(userData.name + " - " + userData.bio);
}

function setProfileInfo(userData) {
    $('#avatar').attr("src", userData.avatar_url)
    $('#header').append(userData.name);
    $('#subheader').append(userData.bio);
}

function setLinks(userData, socialAccounts) {
    let links = [];

    if (userData.html_url !== null) {
        links.push(getLink(userData.login, "bi bi-github", userData.html_url));
    }

    socialAccounts.forEach((element) => {
        let text = element.provider;
        let icon = "bi bi-link-45deg";

        if (element.provider == "linkedin") {
            let match = li_regexp.exec(element.url);
            text = match != null ? match[1] : element.provider;
            icon = "bi bi-linkedin";
        }
        
        links.push(getLink(text, icon, element.url));
    });

    if (userData.email !== null) {
        links.push(getLink(userData.email, "bi bi-envelope-fill", "mailto:" + userData.email));
    }

    $("#links").append(links.join(" | "));
}

function setReadme(readmeContent) {
    let parsedReadme = marked.parse(readmeContent);
    $("#readme").append(parsedReadme);
}