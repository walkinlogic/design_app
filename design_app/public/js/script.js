frappe.views.ListView.prototype.render_count = function () {

    if (!this.list_view_settings.disable_count) {
        this.get_count_str().then((str) => {
            //this.$result.find(".list-count").html(`<span>${str}</span>`);
            //this.$result.find(".list-count").addClass('hide');
            this.$page.find(".listcount").html(`<p>${str}</p>`);
        });
    }

}
frappe.ui.form.Control.prototype.make = function () {
    this.make_wrapper();
    this.$wrapper
        .attr("data-fieldtype", this.df.fieldtype)
        .attr("data-fieldname", this.df.fieldname);
    this.wrapper = this.$wrapper.get(0);
    if (this.wrapper) {
        this.wrapper.fieldobj = this; // reference for event handlers
    }

}
frappe.views.BaseList.prototype.setup_paging_area = function () {
    const paging_values = [20, 100, 500, 100];
    this.$paging_area = $(
        `<div class="list-paging-area level">
            <div class="level-left">
            </div>
            <div class="level-right">
                <p>Rows per page:</p>
                <div class="btn-group">
                    <select class="btnpaging form-control input-xs">
                    ${paging_values.map(
            (value) => `
                                                <option  class="btn-paging"
                                                    data-value="${value}" value="${value}">
                                                    ${value}
                                                </option>
                                            `
        )
            .join("")}
                    </select>
                    <svg width="13.5" height="7.5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.246094 0.276665L4.52943 4.56L8.81276 0.276665H0.246094Z" fill="black" fill-opacity="0.54"/>
                    </svg>
                </div> 
                <div class="listcount"></div>
                <button class="btn btn-default btn-more btn-sm">
                    ${__("Load More")}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 20" width="15" height="18">
                    <path d="M6.8707 2.92411V0.834822L3.71066 3.62054L6.8707 6.41071V4.31696C7.4926 4.31696 8.10841 4.42519 8.68291 
                    4.63547C9.25741 4.84574 9.77934 5.15393 10.2189 5.54242C10.6584 5.93091 11.0069 6.39208 11.2444 6.89956C11.4819 
                    7.40704 11.6038 7.95089 11.6032 8.5C11.6018 9.18107 11.4145 9.8518 11.0571 10.4554L12.2099 11.4732C12.8119 10.6299 
                    13.1469 9.65944 13.1799 8.66297C13.2129 7.66651 12.9427 6.68045 12.3975 5.80749C11.8523 4.93453 11.0521 4.20659 
                    10.08 3.69947C9.10798 3.19235 7.99974 2.9246 6.8707 2.92411ZM6.8707 12.6786C6.05432 12.6792 5.25165 12.4933 4.54068 
                    12.1391C3.82971 11.7848 3.23463 11.2741 2.81326 10.6567C2.39189 10.0394 2.15857 9.33623 2.13597 8.61568C2.11337 
                    7.89513 2.30225 7.18168 2.68428 6.54464L1.53149 5.52679C0.927724 6.36984 0.591359 7.34056 0.55752 8.33758C0.52368 
                    9.3346 0.793607 10.3214 1.33912 11.1948C1.88463 12.0683 2.68571 12.7964 3.65873 13.3032C4.63175 13.81 5.74101 
                    14.0768 6.8707 14.0759V16.1652L10.0257 13.375L6.8707 10.5893V12.6786Z" fill="#5B5B98"></path>
                    </svg>
                </button>
            </div>
        </div>`
    ).hide();
    this.$frappe_list.append(this.$paging_area);

    // set default paging btn active
    this.$paging_area
        .find(`.btn-paging[data-value="${this.page_length}"]`)
        .addClass("btn-info");

    this.$paging_area.on("change", ".btnpaging", (e) => {

        const $this = $(e.currentTarget);
        console.log("e", $this.val());
        this.start = 0;
        this.page_length = this.selected_page_count = $this.val();

        this.$paging_area.find(".btn-paging").removeClass("btn-info");
        this.$paging_area.find(".btnpaging  option[value='" + this.page_length + "']").addClass('btn-info');

        this.refresh();
    });
    this.$paging_area.on("click", ".btn-more", (e) => {
        const $this = $(e.currentTarget);

        if ($this.is(".btn-paging")) {
            // set active button
            this.$paging_area.find(".btn-paging").removeClass("btn-info");
            $this.addClass("btn-info");

            this.start = 0;
            this.page_length = this.selected_page_count = $this.data().value;
        } else if ($this.is(".btn-more")) {
            this.start = this.start + this.page_length;
            this.page_length = this.selected_page_count || 20;
        }
        this.refresh();
    });

}
frappe.views.Workspace.prototype.setup_actions = function (page) {
    let pages = page.public ? this.public_pages : this.private_pages;
    let current_page = pages.filter((p) => p.title == page.name)[0];

    if (!this.is_read_only) {
        this.setup_customization_buttons(current_page);
        return;
    }

    this.clear_page_actions();
}

frappe.views.FormFactory.prototype.setup_events = function () {
    if (!this.initialized) {
        $(document).on("page-change", function () {
            frappe.ui.form.close_grid_form();
        });

        frappe.realtime.on("doc_viewers", function (data) {
            // set users that currently viewing the form
            frappe.ui.form.FormViewers.set_users(data, "viewers");
        });

        frappe.realtime.on("doc_typers", function (data) {
            // set users that currently typing on the form
            frappe.ui.form.FormViewers.set_users(data, "typers");
        });
    }
    this.initialized = true;
    let current_page = localStorage.getItem('current_page');
    let all_pages = localStorage.getItem('all_pages');
    let page = '';

    if (all_pages) {
        all_pages = JSON.parse(all_pages);
        all_pages.forEach((item) => {
            if (item.name == current_page) {
                page = item;
            }
        });
    }

    if (page) {
        get_data(page, this);
    }

}

frappe.views.Workspace.prototype.make_sidebar = function () {


    if (this.sidebar.find(".standard-sidebar-section")[0]) {
        this.sidebar.find(".standard-sidebar-section").remove();
    }

    this.sidebar_categories.forEach((category) => {
        let root_pages = this.public_pages.filter(
            (page) => page.parent_page == "" || page.parent_page == null
        );
        if (category != "Public") {
            root_pages = this.private_pages.filter(
                (page) => page.parent_page == "" || page.parent_page == null
            );
        }
        root_pages = root_pages.uniqBy((d) => d.title);
        this.build_sidebar_section(category, root_pages);

    });
    // Scroll sidebar to selected page if it is not in viewport.
    this.sidebar.find(".selected").length &&
        !frappe.dom.is_element_in_viewport(this.sidebar.find(".selected")) &&
        this.sidebar.find(".selected")[0].scrollIntoView();

    this.remove_sidebar_skeleton();
}

frappe.views.BaseList.prototype.setup_page = function () {

    this.page = this.parent.page;
    this.$page = $(this.parent);
    !this.hide_card_layout && this.page.main.addClass("frappe-card");
    this.page.page_form.removeClass("row").addClass("flex");
    this.hide_page_form && this.page.page_form.hide();
    this.hide_sidebar && this.$page.addClass("no-list-sidebar");
    this.setup_page_head();
    //get_data(this.page)


    let current_page = localStorage.getItem('current_page');
    let all_pages = localStorage.getItem('all_pages');
    let page = '';
    if (all_pages) {
        all_pages = JSON.parse(all_pages);
        all_pages.forEach((item) => {
            if (item.name == current_page) {
                page = item;
            }
        });
    }
    if (page) {
        get_data(page, this);
    }
}

frappe.views.Workspace.prototype.show_page = async function (page) {

    if (!this.body.find("#editorjs")[0]) {
        this.$page = $(`
            <div id="editorjs" class="desk-page page-main-content"></div>
        `).appendTo(this.body);
    }

    if (this.all_pages) {
        this.create_page_skeleton();

        let pages = page.public ? this.public_pages : this.private_pages;
        let current_page = pages.filter((p) => p.title == page.name)[0];
        this.content = current_page && JSON.parse(current_page.content);

        this.content && this.add_custom_cards_in_content();

        $(".item-anchor").addClass("disable-click");

        if (this.pages && this.pages[current_page.name]) {
            this.page_data = this.pages[current_page.name];
        } else {
            await frappe.after_ajax(() => this.get_data(current_page));
        }

        this.setup_actions(page);

        this.prepare_editorjs();
        $(".item-anchor").removeClass("disable-click");
        let page_data = this.page_data;
        if (page_data) {

            if (page_data.cards.items) {
                let carditems = page_data.cards.items;
                let htmlview = '<ul class="nav nav-tabs">';
                let submenu = '';
                let isactive = 'active';
                let subisactive = 'active show';
                let adddashboard = 1;
                let defaulturl = false;
                let defaultnewurl = '';
                let defaultroute = '';
                carditems.forEach((item) => {
                    if (item.links) {
                        let links = item.links;
                        htmlview += '<li class="nav-item maintabsmenu"><a class="nav-link navtab ' + isactive + '" data-toggle="tab" href="javascript:void(0);" id="maintab' + item.name + '" data-tab="#tab' + item.name + '">' + item.label + '<svg class="icon icon-sm" style=""><use class="" href="#icon-small-down-2"></use></svg></a > ';
                        htmlview += '</li>';
                        submenu += '<div id="tab' + item.name + '" class="tab-pane subtabs fade ' + subisactive + '"><ul class="nav nav-tabs">';

                        if (adddashboard) {
                            const route = '/app/' + item.parent.toLowerCase();

                            var currentURL = window.location.href;
                            var domainWithPort = window.location.host;
                            let resultArray = currentURL.split(domainWithPort);
                            resulturl = resultArray[1].replace(/%20/g, " ")
                            resulturl = resulturl.split("?");

                            if (resulturl[0].toLowerCase() == route) {
                                defaulturl = true;
                                // isactive = "active";
                                // subisactive = 'show active';
                                // submenu += '<li class="nav-item active"><a data-label="tab' + item.name + '" href="' + route + '">Dashboard</a></li>';
                            } else {
                                // submenu += '<li class="nav-item"><a data-label="tab' + item.name + '" href="' + route + '">Dashboard</a></li>';
                            }
                            adddashboard = 0;
                        }

                        links.forEach((link) => {
                            const opts = {
                                name: link.link_to,
                                type: link.link_type,
                                doctype: link.doctype,
                                is_query_report: link.is_query_report
                            };

                            if (link.link_type.toLowerCase() == "report" && !link.is_query_report) {
                                opts.doctype = this.dependencies;
                            }

                            const route = frappe.utils.generate_route(opts);

                            if (defaultnewurl == '') {
                                defaultnewurl = opts;
                                defaultroute = route;
                            }

                            var currentURL = window.location.href;
                            var domainWithPort = window.location.host;
                            let resultArray = currentURL.split(domainWithPort);
                            resulturl = resultArray[1].replace(/%20/g, " ")
                            resulturl = resulturl.split("?");

                            if (resulturl[0] == route) {
                                isactive = "active";
                                subisactive = 'show active';
                                submenu += '<li class="nav-item active"><a data-label="tab' + item.name + '" href="' + route + '">' + link.label + '</a></li>';
                            } else {
                                submenu += '<li class="nav-item ' + subisactive + '"><a data-label="tab' + item.name + '" href="' + route + '">' + link.label + '</a></li>';
                                subisactive = '';
                            }

                        });
                        submenu += '</ul></div>';

                    } else {
                        htmlview += '<li class="nav-item"><a class="nav-link" href="#">' + item.label + '</a></li>';
                    }
                    isactive = '';
                    subisactive = '';
                });
                htmlview += '</ul>';
                submenu += '';

                $(".layout-main-tabs-wrapper").html(
                    `<div class="tabbed-container">
                    <div class="form-wrapper">
                      <div class="form-inner-wrapper">
                        <div class="container">${htmlview}</div> 
                      </div>
                    </div> 
                    <div class="tab-content">
                    <div class="container">${submenu}</div> 
                    </div>
                  </div>`
                );

                if (defaulturl) {
                    frappe.set_route("List", defaultnewurl.doctype);
                }

                setTimeout(function () {

                    let tid = $('.layout-main-tabs-wrapper .tab-content .subtabs .active').parent().parent().attr('id');

                    if (tid) {
                        let title = $('.layout-main-tabs-wrapper .tab-content .subtabs .active a').attr("data-title");
                        $('.topagedetail .blocktext .ellipsis').html(title);

                        $('.maintabsmenu a').removeClass('active');
                        $('.maintabsmenu #main' + tid).addClass('active');
                        $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('active show');
                        $('.layout-main-tabs-wrapper .tab-content .subtabs .active').parent().parent().addClass('active show');
                        $('.maintabsmenu #main' + tid).addClass('active');
                    }
                    $('.subtabs .nav-item a').click(function (event) {
                        let tid = $(this).attr('data-label');
                        let title = $(this).attr("data-title");
                        $('.topagedetail .blocktext .ellipsis').html(title);
                        $('.subtabs .nav-item').removeClass('active');
                        $(this).parent().addClass('active');
                        if (tid) {
                            $('.maintabsmenu a').removeClass('active');
                            $('.maintabsmenu #main' + tid).addClass('active');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('active show');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs .active').parent().parent().addClass('active show');
                            $('.maintabsmenu #main' + tid).addClass('active');
                        }
                    });


                    $('.maintabsmenu a.navtab').click(function (event) {
                        event.preventDefault()
                        $('.maintabsmenu a').removeClass('active');
                        $(this).addClass('active');
                        let tabname = $(this).attr('data-tab');
                        $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('active');
                        $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('show');
                        $('.layout-main-tabs-wrapper .tab-content .subtabs' + tabname).addClass('active');
                        $('.layout-main-tabs-wrapper .tab-content .subtabs' + tabname).addClass('show');
                    });
                }, 200)
            }
        }

        this.remove_page_skeleton();
    }
}

frappe.views.ListGroupBy.prototype.make_wrapper = function () {
    this.$wrapper = this.sidebar.sidebar.find(".list-group-by");
    let html = `
        <li class="add-list-group-by sidebar-action">
            <a class="add-group-by">
                ${__("Edit Filters")}
            </a>
        </li>
        <div class="list-group-by-fields">
        </div> 
    `;
    this.$wrapper.html(html);
}

frappe.views.ListGroupBy.prototype.render_group_by_items = function () {
    let get_item_html = (fieldname) => {
        let label, fieldtype;
        if (fieldname === "assigned_to") {
            label = __("Assigned To");
        } else if (fieldname === "owner") {
            label = __("Created By");
        } else {
            label = frappe.meta.get_label(this.doctype, fieldname);
            let docfield = frappe.meta.get_docfield(this.doctype, fieldname);
            if (!docfield) {
                return;
            }
            fieldtype = docfield.fieldtype;
        }

        return `<li class="group-by-field list-link">
                <a class="btn btn-default btn-sm list-sidebar-button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false"
                data-label="${label}" data-fieldname="${fieldname}" data-fieldtype="${fieldtype}"
                href="#" onclick="return false;">
                    <span class="ellipsis">${__(label)}</span>
                    <span>${frappe.utils.icon("select", "xs")}</span>
                </a>
                <ul class="dropdown-menu group-by-dropdown" role="menu">
                </ul>
        </li>`;
    };
    let html = this.group_by_fields.map(get_item_html).join("");
    this.$wrapper.find(".list-group-by-fields").html(html);
}

frappe.views.Workspace.prototype.prepare_container = async function () {
    let list_sidebar = $(`
        <div class="mainlistsidebar list-sidebar overlay-sidebar hidden-xs hidden-sm">
            <div class="desk-sidebar list-unstyled sidebar-menu"></div>
        </div>
    `).appendTo($(".layout-side-section"));
    this.sidebar = list_sidebar.find(".desk-sidebar");
    this.body = this.wrapper.find(".layout-main-section");
    this.wrapper.find(".layout-side-section").remove();
}

frappe.ui.Page.prototype.add_main_section = async function () {
    $(frappe.render_template("page", {})).appendTo(this.wrapper);
    if (this.single_column) {
        // nesting under col-sm-12 for consistency
        this.add_view(
            "main",
            `<div class="row layout-main">   
                <div class="col-md-12 layout-main-section-wrapper">
                    <div class="layout-main-section"></div>
                    <div class="layout-footer hide"></div>
                </div>
            </div>`
        );
    } else {
        this.add_view(
            "main",
            `
            <div class="row layout-main">  
                <div class="col layout-main-section-wrapper">
                    <div class="layout-main-section"></div>
                    <div class="layout-footer hide"></div>
                </div>
            </div>
        `
        );
    }

    this.setup_page();
}

frappe.ui.Notifications.prototype.make = function () {
    $(".dropdown-notifications").removeClass("hidden");
    this.dropdown = $(".dropdown-notifications");
    this.dropdown_list = this.dropdown.find(".notifications-list");
    this.header_items = this.dropdown_list.find(".header-items");
    this.header_actions = this.dropdown_list.find(".header-actions");
    this.body = this.dropdown_list.find(".notification-list-body");
    this.panel_events = this.dropdown_list.find(".panel-events");
    this.panel_notifications = this.dropdown_list.find(".panel-notifications");

    this.user = frappe.session.user;
    this.setup_headers();
    this.setup_dropdown_events();
}

frappe.ui.Page.prototype.setup_page = function () {
    this.$title_area = this.wrapper.find(".title-area");

    this.$sub_title_area = this.wrapper.find("h6");

    if (this.title) this.set_title(this.title);

    if (this.icon) this.get_main_icon(this.icon);

    this.body = this.main = this.wrapper.find(".layout-main-section");
    this.container = this.wrapper.find(".page-body");
    this.sidebar = this.wrapper.find(".layout-side-section"); /* Changed */
    this.footer = this.wrapper.find(".layout-footer");
    this.indicator = this.wrapper.find(".indicator-pill");

    this.page_actions = this.wrapper.find(".page-actions");

    this.btn_primary = this.page_actions.find(".primary-action");
    this.btn_secondary = this.page_actions.find(".btn-secondary");

    this.menu = this.page_actions.find(".menu-btn-group .dropdown-menu");
    this.menu_btn_group = this.page_actions.find(".menu-btn-group");

    this.actions = this.page_actions.find(".actions-btn-group .dropdown-menu");
    this.actions_btn_group = this.page_actions.find(".actions-btn-group");

    this.standard_actions = this.page_actions.find(".standard-actions");
    this.custom_actions = this.page_actions.find(".custom-actions");

    this.page_form = $('<div class="page-form row hide"></div>').prependTo(this.main);
    this.inner_toolbar = this.custom_actions;
    this.icon_group = this.page_actions.find(".page-icon-group");

    if (this.make_page) {
        this.make_page();
    }

    this.card_layout && this.main.addClass("frappe-card");

    // keyboard shortcuts
    let menu_btn = this.menu_btn_group.find("button");
    menu_btn.attr("title", __("Menu")).tooltip({ delay: { show: 600, hide: 100 } });
    frappe.ui.keys
        .get_shortcut_group(this.page_actions[0])
        .add(menu_btn, menu_btn.find(".menu-btn-group-label"));

    let action_btn = this.actions_btn_group.find("button");
    frappe.ui.keys
        .get_shortcut_group(this.page_actions[0])
        .add(action_btn, action_btn.find(".actions-btn-group-label"));
}

frappe.ui.Page.prototype.add_sidebar_item = function (label, action, insert_after, prepend) {
    var parent = $(".sidebar-menu.standard-actions");
    var li = $("<li>");
    var link = $("<a>").html(label).on("click", action).appendTo(li);

    if (insert_after) {
        li.insertAfter(parent.find(insert_after));
    } else {
        if (prepend) {
            li.prependTo(parent);
        } else {
            li.appendTo(parent);
        }
    }
    return link;
}

frappe.ui.Page.prototype.setup_sidebar_toggle = function () {
    let sidebar_toggle = $(".page-head").find(".sidebar-toggle-btn");
    let sidebar_wrapper = this.wrapper.find(".layout-side-section");
    // let sidebar_wrapper = $(".layout-side-section");
    if (this.disable_sidebar_toggle || !sidebar_wrapper.length) {
        sidebar_toggle.remove();
    } else {
        sidebar_toggle.attr("title", __("Toggle Sidebar")).tooltip({
            delay: { show: 600, hide: 100 },
            trigger: "hover",
        });
        sidebar_toggle.click(() => {
            if (frappe.utils.is_xs() || frappe.utils.is_sm()) {
                this.setup_overlay_sidebar();
            } else {
                sidebar_wrapper.toggle();
            }
            $(document.body).trigger("toggleSidebar");
            this.update_sidebar_icon();
        });
    }
}

let sidebar;
let public_pages;
let private_pages;
let sidebar_categories;
let all_pages;
let sidebar_items = {
    public: {},
    private: {},
};
current_page = {};

function getsidebaritems() {
    let helpmenu = '';
    help_dropdown = frappe.boot.navbar_settings.help_dropdown;
    help_dropdown.forEach((item) => {
        if (!item.hidden) {
            if (item.route) {
                helpmenu += ` <a class="dropdown-item" href="${item.route}">
                                ${__(item.item_label)}
                            </a>`;
            } else if (item.action) {
                helpmenu += ` <a class="dropdown-item"  onclick="return ${item.action}">
                                ${__(item.item_label)}
                            </a>`;
            } else {
                helpmenu += ` <div class="dropdown-divider"></div>`;
            }

        }
    });

    let usermenu = '';
    settings_dropdown = frappe.boot.navbar_settings.settings_dropdown;
    settings_dropdown.forEach((item) => {
        if (!item.hidden) {
            if (item.route) {
                usermenu += ` <a class="dropdown-item" href="${item.route}">
                                ${__(item.item_label)}
                            </a>`;
            } else if (item.action) {
                usermenu += ` <a class="dropdown-item" onclick="return ${item.action}">
                                ${__(item.item_label)}
                            </a>`;
            } else {
                usermenu += ` <div class="dropdown-divider"></div>`;
            }

        }

    });

    $(`<div class="container navbar">
    <div class="menu-btn mobilemenu">
        <a class="navbar-brand navbar-home" href="/app">
            <img class="app-logo" style="width: 55px"
                src="${frappe.boot.app_logo_url}">
        </a>
        <button class="nav-link showmobilemenu" onclick="togglemobilenav()"><i
                class="fa-solid fa-bars"></i></button>
    </div>
     <div class="collapse navbar-collapse show justify-content-end"> 
         <ul class="navbar-nav">
             <li class="nav-item dropdown dropdown-notifications dropdown-mobile">
                 <a class="nav-link notifications-icon text-muted" data-toggle="dropdown" aria-haspopup="true"
                     aria-expanded="true" href="#" onclick="return false;">
                     <span class="notifications-seen">
                         <svg class="icon icon-md">
                             <use href="#icon-notification"></use>
                         </svg>
                     </span>
                     <span class="notifications-unseen">
                         <svg class="icon icon-md">
                             <use href="#icon-notification-with-indicator"></use>
                         </svg>
                     </span>
                 </a>
                 <div class="dropdown-menu notifications-list dropdown-menu-right" role="menu">
                     <div class="notification-list-header">
                         <div class="header-items"></div>
                         <div class="header-actions"></div>
                     </div>
                     <div class="notification-list-body">
                         <div class="panel-notifications"></div>
                         <div class="panel-events"></div>
                     </div>
                 </div>
             </li>
             <li class="nav-item dropdown dropdown-message dropdown-mobile  hidden">
                 <a class="nav-link notifications-icon text-muted" data-toggle="dropdown" aria-haspopup="true"
                     aria-expanded="true" href="#" onclick="return false;">
                     <span>
                         <svg class="icon icon-md">
                             <use href="#icon-small-message"></use>
                         </svg>
                     </span>
                 </a>
             </li> 
             <li class="nav-item dropdown dropdown-help dropdown-mobile hidden">
                 <a class="nav-link" data-toggle="dropdown" href="#" onclick="return false;">
                     ${__("Help")}
                     <span>
                         <svg class="icon icon-xs">
                             <use href="#icon-small-down"></use>
                         </svg>
                     </span>
                 </a>
                 <div class="dropdown-menu dropdown-menu-right" id="toolbar-help" role="menu">
                     <div id="help-links"></div>
                     <div class="dropdown-divider documentation-links"></div>
                      ${helpmenu}
                 </div>
             </li>
             <li class="nav-item dropdown dropdown-navbar-user dropdown-mobile center">
             <a class="nav-link" data-toggle="dropdown" href="#" onclick="return false;">
             <span class="avatar avatar-small" title="Administrator">
                <svg class="avatar-frame" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.982 18.7247C17.2833 17.7996 16.3793 17.0493 15.3412 16.5331C14.3031 16.0168 13.1594 15.7487 12 15.7497C10.8407 15.7487 9.6969 16.0168 8.65883 16.5331C7.62077 17.0493 6.71675 17.7996 6.01801 18.7247M17.982 18.7247C19.3455 17.5119 20.3071 15.9133 20.7412 14.1408C21.1753 12.3683 21.0603 10.5058 20.4115 8.80018C19.7627 7.09457 18.6107 5.62648 17.1084 4.5906C15.6061 3.55472 13.8244 3 11.9995 3C10.1747 3 8.39295 3.55472 6.89062 4.5906C5.38829 5.62648 4.23634 7.09457 3.58755 8.80018C2.93875 10.5058 2.82376 12.3683 3.25783 14.1408C3.6919 15.9133 4.65451 17.5119 6.01801 18.7247M17.982 18.7247C16.336 20.1929 14.2056 21.0028 12 20.9997C9.79404 21.0031 7.66425 20.1931 6.01801 18.7247M15 9.74971C15 10.5454 14.6839 11.3084 14.1213 11.871C13.5587 12.4336 12.7957 12.7497 12 12.7497C11.2044 12.7497 10.4413 12.4336 9.87869 11.871C9.31608 11.3084 9.00001 10.5454 9.00001 9.74971C9.00001 8.95406 9.31608 8.19099 9.87869 7.62838C10.4413 7.06578 11.2044 6.74971 12 6.74971C12.7957 6.74971 13.5587 7.06578 14.1213 7.62838C14.6839 8.19099 15 8.95406 15 9.74971Z" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class='user-active'></span>
             </span>
             </a>
             <div class="dropdown-menu dropdown-menu-right" id="toolbar-user" role="menu">
                 ${usermenu}
             </div>
         </li>
             
         </ul>
     </div>
 </div>
    <div class="userlogo">
        <ul class="navbar-nav">
                <li class="nav-item dropdown dropdown-navbar-user dropdown-mobile center">
                        <a class="nav-link"  href="#" onclick="return false;">
                            ${frappe.avatar(frappe.session.user, "avatar-medium")}
                            <span class="user-name-sub-text username">${frappe.session.user}</span>
                            <span class="user-name-sub-text emailtext">${frappe.session.user_email}</span> 
                        </a> 
                    </li>
        </ul>
    </div>`).appendTo($(".mainhead"));

    let list_sidebar = $(`
        <div class="maintoplistsidebar list-sidebar overlay-sidebar hidden-xs hidden-sm">
            <div class="desk-sidebar list-unstyled sidebar-menu"></div>
        </div>
    `).appendTo($(".layout-side-section-menu"));

    sidebar = list_sidebar.find(".desk-sidebar");

    sidebar_categories = ["My Workspaces", "Public"];


    frappe.call({
        method: "frappe.desk.desktop.get_workspace_sidebar_items",
        freeze: true,
        callback: function (r) {

            all_pages = r.message.pages;

            all_pages.forEach(async (page) => {
                const sr = await frappe.call({ "method": "frappe.desk.desktop.get_desktop_page", args: { page: page }, freeze: true });
                let link = sr.message.cards.items[0].links[0];
                const opts = {
                    name: link.link_to,
                    type: link.link_type,
                    doctype: link.doctype,
                    is_query_report: link.is_query_report
                };

                if (link.link_type.toLowerCase() == "report" && !link.is_query_report) {
                    opts.doctype = this.dependencies;
                }

                const route = frappe.utils.generate_route(opts);
                page.route = route;
            });

            setTimeout(function () {
                createsidebarmenu();
                loadtabmenu('');
            }, 2500)/* Changed */


            $('.avatarbody').html(frappe.avatar(frappe.session.user, "avatar-large"));
            if (frappe.session.user == undefined) {
                $('.username.welcomeback').html("Welcome back!");
            } else {
                $('.username.welcomeback').html("Welcome back, " + frappe.session.user + "!");
            }

        }
    });
}

function createsidebarmenu() {
    localStorage.setItem('all_pages', JSON.stringify(all_pages));
    all_pages.forEach((page) => {
        page.is_editable = !page.public;
    });

    public_pages = all_pages.filter((page) => page.public);
    private_pages = all_pages.filter((page) => !page.public);
    if (all_pages) {
        frappe.workspaces = {};
        for (let page of all_pages) {
            frappe.workspaces[frappe.router.slug(page.name)] = { title: page.title };
        }
        if (sidebar.find(".standard-sidebar-section")[0]) {
            sidebar.find(".standard-sidebar-section").remove();
        }

        sidebar_categories.forEach((category) => {
            let root_pages = public_pages.filter(
                (page) => page.parent_page == "" || page.parent_page == null
            );
            if (category != "Public") {
                root_pages = private_pages.filter(
                    (page) => page.parent_page == "" || page.parent_page == null
                );
            }
            root_pages = root_pages.uniqBy((d) => d.title);
            build_sidebar_section(category, root_pages);
        });

        // Scroll sidebar to selected page if it is not in viewport.
        /* Changed */
        $('.layout-side-section-menu').find(".selected").length &&
            !frappe.dom.is_element_in_viewport($('.layout-side-section-menu').find(".selected")) &&
            $('.layout-side-section-menu').find(".selected")[0].scrollIntoView();

        $('.item-anchor').click(function () {
            $('.desk-sidebar-item').removeClass('selected');
            $(this).parent().addClass('selected');
        })

        /* Changed Added new */
        setTimeout(function () {
            $('.standard-sidebar-item.selected').parent().parent().siblings('.standard-sidebar-item').find('.sidebar-item-control .drop-icon').click();
        }, 1000);
        // reload && this.show();
    }
}

function create_sidebar_skeleton() {
    if ($(".workspace-sidebar-skeleton").length) return;

    $(frappe.render_template("workspace_sidebar_loading_skeleton")).insertBefore(sidebar);
    sidebar.addClass("hidden");
}

function prepare_sidebar(items, child_container, item_container) {
    items.forEach((item) => append_item(item, child_container));
    child_container.appendTo(item_container);
}

function build_sidebar_section(title, root_pages) {
    let sidebar_section = $(
        `<div class="standard-sidebar-section nested-container" data-title="${title}"></div>`
    );

    let $title = $(`<div class="standard-sidebar-label">
        <span>${frappe.utils.icon("small-down", "xs")}</span>
        <span class="section-title">${__(title)}<span>
    </div>`).appendTo(sidebar_section);
    prepare_sidebar(root_pages, sidebar_section, sidebar);

    $title.on("click", (e) => {
        let icon =
            $(e.target).find("span use").attr("href") === "#icon-small-down"
                ? "#icon-right-2"
                : "#icon-small-down";
        $(e.target).find("span use").attr("href", icon);
        $(e.target).parent().find(".sidebar-item-container").toggleClass("hidden");
    });

    if (Object.keys(root_pages).length === 0) {
        sidebar_section.addClass("hidden");
    }

    if (
        sidebar_section.find(".sidebar-item-container").length &&
        sidebar_section.find("> [item-is-hidden='0']").length == 0
    ) {
        sidebar_section.addClass("hidden show-in-edit-mode");
    }
}

function append_item(item, container) {

    let is_current_page =
        frappe.router.slug(item.title) == frappe.router.slug(get_page_to_show().name) &&
        item.public == get_page_to_show().public;

    item.selected = is_current_page;
    if (is_current_page) {
        current_page = { name: item.title, public: item.public };
    }

    let $item_container = sidebar_item_container(item);
    let sidebar_control = $item_container.find(".sidebar-item-control");

    add_sidebar_actions(item, sidebar_control);
    let pages = item.public ? public_pages : private_pages;

    let child_items = pages.filter((page) => page.parent_page == item.title);
    if (child_items.length > 0) {
        let child_container = $item_container.find(".sidebar-child-item");
        child_container.addClass("hidden");
        prepare_sidebar(child_items, child_container, $item_container);
    }

    $item_container.appendTo(container);
    sidebar_items[item.public ? "public" : "private"][item.title] = $item_container;

    if ($item_container.parent().hasClass("hidden") && is_current_page) {
        $item_container.parent().toggleClass("hidden");
    }

    add_drop_icon(item, sidebar_control, $item_container);

    if (child_items.length > 0) {
        $item_container.find(".drop-icon").first().addClass("show-in-edit-mode");
    }
}

function get_page_to_show() {
    let default_page;

    if (
        localStorage.current_page &&
        all_pages.filter((page) => page.title == localStorage.current_page).length != 0
    ) {
        default_page = {
            name: localStorage.current_page,
            public: localStorage.is_current_page_public == "true",
        };
    } else if (Object.keys(all_pages).length !== 0) {
        default_page = { name: all_pages[0].title, public: true };
    } else {
        default_page = { name: "Build", public: true };
    }
    let page;

    if (frappe.get_route()) {
        page =
            (frappe.get_route()[1] == "private" ? frappe.get_route()[2] : frappe.get_route()[1]) ||
            default_page.name;
    } else {
        page =
            default_page.name;
    }
    let is_public;
    if (frappe.get_route()) {
        is_public = frappe.get_route()[1]
            ? frappe.get_route()[1] != "private"
            : default_page.public;
    } else {
        is_public = default_page.public;
    }

    return { name: page, public: is_public };
}

function sidebar_item_container(item) {
    return $(`
        <div
            class="sidebar-item-container ${item.is_editable ? "is-draggable" : ""}"
            item-parent="${item.parent_page}"
            item-name="${item.title}"
            item-public="${item.public || 0}"
            item-is-hidden="${item.is_hidden || 0}"
        >
            <div class="desk-sidebar-item standard-sidebar-item ${item.selected ? "selected" : ""}" id="selected${item.name.replace(/ /g, "")}">
                <a
                    onclick="loadtabmenu('${item.name}')"
                    href="${item.route}" 
                    class="item-anchor ${item.is_editable ? "" : "block-click"}" title="${__(item.title)}"
                >
                    <span class="sidebar-item-icon" item-icon=${item.icon || "folder-normal"}>${frappe.utils.icon(
        item.icon || "folder-normal",
        "md"
    )}</span>
                    <span class="sidebar-item-label">${__(item.title)}<span>
                </a>
                <div class="sidebar-item-control"></div>
            </div>
            <div class="sidebar-child-item nested-container"></div>
        </div>
    `);
}

function add_sidebar_actions(item, sidebar_control, is_new) {
    if (!item.is_hidden) {

        frappe.utils.add_custom_button(
            frappe.utils.icon("drag", "xs"),
            null,
            "drag-handle",
            __("Drag"),
            null,
            sidebar_control
        );

        // !is_new && add_settings_button(item, sidebar_control);
    }
}

function add_drop_icon(item, sidebar_control, item_container) {
    let drop_icon = "small-down";
    if (item_container.find(`[item-name="${current_page.name}"]`).length) {
        drop_icon = "small-up";
    }

    let $child_item_section = item_container.find(".sidebar-child-item");
    let $drop_icon = $(
        `<span class="drop-icon hidden">${frappe.utils.icon(drop_icon, "sm")}</span>`
    ).appendTo(sidebar_control);
    let pages = item.public ? public_pages : private_pages;
    if (
        pages.some(
            (e) => e.parent_page == item.title && (e.is_hidden == 0)
        )
    ) {
        $drop_icon.removeClass("hidden");
    }
    $drop_icon.on("click", () => {
        let icon =
            $drop_icon.find("use").attr("href") === "#icon-small-down"
                ? "#icon-small-up"
                : "#icon-small-down";
        $drop_icon.find("use").attr("href", icon);
        $child_item_section.toggleClass("hidden");
    });
}

function get_data(page, ele) {
    return '';
}

function loadtabmenu(page) {
    if (page) {
        localStorage.setItem('current_page', page);
    }
    let current_page = localStorage.getItem('current_page');
    //let current_page = page;
    let all_pages = localStorage.getItem('all_pages');
    let cpage = current_page.replace(/ /g, "");

    setTimeout(function () {
        let cpages = current_page.replace(/ /g, "");
        $("#selected" + cpages).addClass('selected');


    }, 1500);

    if (all_pages) {
        all_pages = JSON.parse(all_pages);
        all_pages.forEach((item) => {
            if (item.name == current_page) {
                page = item;
            }
        });
    }
    frappe
        .call("frappe.desk.desktop.get_desktop_page", {
            page: page,
        })
        .then((data) => {
            page_data = data.message;
            if (page_data) {
                $('#selected' + current_page).addClass('selected');
                if (page_data.cards.items) {
                    let carditems = page_data.cards.items;
                    let htmlview = '<ul class="nav nav-tabs">';
                    let submenu = '';
                    let isactive = 'active';
                    let subisactive = 'active show';
                    let adddashboard = 1;
                    let defaulturl = false;
                    let defaultnewurl = '';
                    let defaultroute = '';
                    carditems.forEach((item) => {
                        if (item.links) {
                            let links = item.links;
                            let link = links[0];
                            const opts = {
                                name: link.link_to,
                                type: link.link_type,
                                doctype: link.doctype,
                                is_query_report: link.is_query_report
                            };
                            if (link.link_type.toLowerCase() == "report" && !link.is_query_report) {
                                opts.doctype = this.dependencies;
                            }


                            const route = frappe.utils.generate_route(opts);

                            htmlview += '<li class="nav-item maintabsmenu"><a class="nav-link navtab ' + isactive + '" onClick="setactivetab(\'#sub' + link.name + '\')"  data-toggle="tab" href="' + route + '" id="maintab' + item.name + '" data-tab="#tab' + item.name + '">' + item.label + '<svg class="icon icon-sm" style=""><use class="" href="#icon-small-down-2"></use></svg></a > ';
                            htmlview += '</li>';
                            submenu += '<div id="tab' + item.name + '" class="tab-pane subtabs fade ' + subisactive + '"><ul class="nav nav-tabs">';
                            if (adddashboard) {
                                const route = '/app/' + item.parent.toLowerCase();

                                var currentURL = window.location.href;
                                var domainWithPort = window.location.host;
                                let resultArray = currentURL.split(domainWithPort);
                                resulturl = resultArray[1].replace(/%20/g, " ")
                                resulturl = resulturl.split("?");
                                if (resulturl[0].toLowerCase() == route) {
                                    defaulturl = true;
                                    isactive = "active";
                                    subisactive = 'show active';
                                    // submenu += '<li class="nav-item active"><a data-label="tab' + item.name + '" href="' + route + '">Dashboard</a></li>';
                                } else {
                                    // submenu += '<li class="nav-item"><a data-label="tab' + item.name + '" href="' + route + '">Dashboard</a></li>';
                                }

                                adddashboard = 0;
                            }


                            links.forEach((link) => {
                                const opts = {
                                    name: link.link_to,
                                    type: link.link_type,
                                    doctype: link.doctype,
                                    is_query_report: link.is_query_report
                                };
                                if (link.link_type.toLowerCase() == "report" && !link.is_query_report) {
                                    opts.doctype = this.dependencies;
                                }


                                const route = frappe.utils.generate_route(opts);
                                if (defaultnewurl == '') {
                                    defaultnewurl = opts;
                                    defaultroute = route;
                                }


                                var currentURL = window.location.href;
                                var domainWithPort = window.location.host;
                                let resultArray = currentURL.split(domainWithPort);
                                resulturl = resultArray[1].replace(/%20/g, " ")
                                resulturl = resulturl.split("?");

                                if (resulturl[0] == route) {
                                    isactive = "active";
                                    subisactive = 'show active';
                                    submenu += '<li class="nav-item active" id="sub' + link.name + '"><a data-label="tab' + item.name + '" data-title="' + link.label + '" href="' + route + '">' + link.label + '</a></li>';
                                } else {
                                    if (defaulturl && defaultnewurl != '') {
                                        isactive = "active";
                                        subisactive = 'show active';
                                        submenu += '<li class="nav-item active" id="sub' + link.name + '"><a data-label="tab' + item.name + '" data-title="' + link.label + '" href="' + route + '">' + link.label + '</a></li>';
                                    } else {
                                        if (defaulturl && defaultnewurl != '') {
                                            isactive = "active";
                                            subisactive = 'show active';
                                            submenu += '<li class="nav-item active" id="sub' + link.name + '"><a data-label="tab' + item.name + '" data-title="' + link.label + '" href="' + route + '">' + link.label + '</a></li>';
                                        } else {
                                            submenu += '<li class="nav-item" id="sub' + link.name + '"><a data-label="tab' + item.name + '" data-title="' + link.label + '" href="' + route + '">' + link.label + '</a></li>';
                                        }
                                        // submenu += '<li class="nav-item"><a data-label="tab' + item.name + '" href="' + route + '">' + link.label + '</a></li>';
                                    }
                                }

                            });
                            submenu += '</ul></div>';

                        } else {
                            htmlview += '<li class="nav-item"><a class="nav-link" href="#">' + item.label + '</a></li>';
                        }
                        isactive = '';
                        subisactive = '';
                    });
                    htmlview += '</ul>';
                    submenu += '';


                    setTimeout(function () {
                        $(".layout-main-tabs-wrapper").html(
                            `<div class="tabbed-container">
                            <div class="form-wrapper">
                              <div class="form-inner-wrapper">
                                <div class="container">${htmlview}</div> 
                              </div>
                            </div> 
                            <div class="tab-content">
                            <div class="container">${submenu}</div> 
                            </div>
                          </div>`
                        );
                    }, 50);


                    if (defaulturl) {
                        frappe.set_route("List", defaultnewurl.doctype);
                        //window.location.href = defaultroute;
                    }
                    setTimeout(function () {


                        let tid = $('.layout-main-tabs-wrapper .tab-content .subtabs .active').parent().parent().attr('id');

                        if (tid) {
                            let title = $('.layout-main-tabs-wrapper .tab-content .subtabs .active a').attr("data-title");
                            $('.topagedetail .blocktext .ellipsis').html(title);

                            $('.maintabsmenu a').removeClass('active');
                            $('.maintabsmenu #main' + tid).addClass('active');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('active show');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs .active').parent().parent().addClass('active show');
                            $('.maintabsmenu #main' + tid).addClass('active');
                        }
                        $('.subtabs .nav-item a').click(function (event) {
                            let tid = $(this).attr('data-label');
                            $('.subtabs .nav-item').removeClass('active');
                            $(this).parent().addClass('active');
                            let title = $(this).attr("data-title");
                            $('.topagedetail .blocktext .ellipsis').html(title);
                            if (tid) {
                                $('.maintabsmenu a').removeClass('active');
                                $('.maintabsmenu #main' + tid).addClass('active');
                                $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('active show');
                                $('.layout-main-tabs-wrapper .tab-content .subtabs .active').parent().parent().addClass('active show');
                                $('.maintabsmenu #main' + tid).addClass('active');
                            }

                        });
                        $('.maintabsmenu a.navtab').click(function (event) {
                            //event.preventDefault()
                            $('.maintabsmenu a').removeClass('active');
                            $(this).addClass('active');
                            let tabname = $(this).attr('data-tab');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('active');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs').removeClass('show');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs' + tabname).addClass('active');
                            $('.layout-main-tabs-wrapper .tab-content .subtabs' + tabname).addClass('show');
                        });
                    }, 100)

                }
            }
        });
}

function setactivetab(ele) {
    $(ele).addClass('active');
    $(ele + ' a').click();
    let title = $(ele + ' a').attr("data-title");
    $('.topagedetail .blocktext .ellipsis').html(title);
}

// $(document).ready(function () {
getsidebaritems();
// });

function reloadPage() {
    window.location.reload();
}

function sidebartogglebtn() {
    if ($("body").hasClass('closed')) {
        $("body").removeClass('closed')
        localStorage.setItem('navbar', '');
    } else {
        $("body").addClass('closed');
        localStorage.setItem('navbar', 'closed');
    }
}

function togglemobilenav() {
    if ($(".mainapp .maintoplistsidebar").hasClass('open')) {
        $(".mainapp .maintoplistsidebar").removeClass('open')
    } else {
        $(".mainapp .maintoplistsidebar").addClass('open')
    }
}

function scroll_to_el(el, callback) {
    let subnav_height = $('.subnav').outerHeight() || 0;
    let offset_top = $(el).offset().top;
    let position = offset_top - subnav_height;
    $('html, body').animate({ scrollTop: position }, 500, callback);
}

function get_notifications_list() {
    frappe.call({
        method: "frappe.desk.doctype.notification_log.notification_log.get_notification_logs",
        args: {
            limit: 2000
        },
        callback: function (r) {

            let new_item = r.message.notification_logs;
            if (new_item.length > 0) {
                new_item = r.message.notification_logs[0];
                $('.notificationlength').html(new_item.length);
            }
            setTimeout(function () {
                get_notifications_list();
            }, 10000)
        }
    });
}

window.addEventListener('popstate', reloadPage);
$(document).ready(function () {
    $('.userlogo .username').html(frappe.session.user);
    $('.userlogo .emailtext').html(frappe.session.user_email);
    var mode = localStorage.getItem('navbar');
    if (mode == 'closed') {
        $("body").addClass('closed');
    }
    get_notifications_list();
});

$(window).on('load', () => {
    let hash = window.location.hash;
    if (hash) {
        let el = document.querySelector(hash);
        scroll_to_el(el);
    }
});