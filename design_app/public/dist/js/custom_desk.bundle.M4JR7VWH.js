(()=>{frappe.templates.navbar=`<header class="navbar navbar-expand sticky-top flex justify-content-center" role="navigation">
    <span class="sidebar-toggle-btn sidebartogglebtn" onclick="sidebartogglebtn()" title=""
        data-original-title="Toggle Sidebar">
        <svg class="icon icon-md sidebar-toggle-placeholder">
            <use href="#icon-menu"></use>
        </svg>
    </span>
    <div class="container">
        <div class="collapse navbar-collapse justify-content-end">
            <form class="form-inline fill-width justify-content-end" role="search" onsubmit="return false;">
                {% if (frappe.boot.read_only) { %}
                <span class="indicator-pill yellow no-indicator-dot" title="{%= __(" Your site is getting upgraded.")
                    %}">
                    {%= __("Read Only Mode") %}
                </span>
                {% } %}
                <div class="input-group search-bar text-muted hidden">
                    <input id="navbar-search" type="text" class="form-control" placeholder="{%= __(" Search or type a
                        command (Ctrl + G)") %}" aria-haspopup="true">
                    <span class="search-icon">
                        <svg class="icon icon-sm">
                            <use href="#icon-search"></use>
                        </svg>
                    </span>
                </div>
            </form>
        </div>
    </div>
</header>`;frappe.templates.list_sidebar=`<ul class="list-unstyled sidebar-menu user-actions hide">
    <li class="divider"></li>
</ul>
<ul class="list-unstyled sidebar-menu">
    <div class="sidebar-section views-section hide">
        <li class="sidebar-label">
        </li>
        <div class="current-view">
            <li class="list-link">
                <a class="btn btn-default btn-sm list-sidebar-button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false" href="#">
                    <span class="selected-view ellipsis">
                    </span>
                    <span>
                        <svg class="icon icon-xs">
                            <use href="#icon-select"></use>
                        </svg>
                    </span>
                </a>
                <ul class="dropdown-menu views-dropdown" role="menu">
                </ul>
            </li>
            <li class="sidebar-action">
                <a class="view-action"></a>
            </li>
        </div>
    </div>

    <div class="sidebar-section filter-section">
        <!-- <li class="sidebar-label">
            {{ __("Filter By") }}
        </li> -->

        <div class="list-group-by">
        </div>

        <div class="list-tags">
            <li class="sidebar-action show-tags">
                <a class="list-tag-preview">{{ __("Show Tags") }}</a>
            </li>
            <li class="list-stats list-link  taglayout">
                <a class="btn btn-default btn-sm list-sidebar-button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false" href="#">
                    <span>{{ __("Tags") }}</span>
                    <span>
                        <svg class="icon icon-xs">
                            <use href="#icon-select"></use>
                        </svg>
                    </span>
                </a>
                <ul class="dropdown-menu list-stats-dropdown" role="menu">
                    <div class="dropdown-search">
                        <input type="text" placeholder={{__("Search") }} data-element="search"
                            class="form-control input-xs">
                    </div>
                    <div class="stat-result">
                    </div>
                </ul>
            </li>
        </div>
        <div class="sidebar-section save-filter-section savefilters">
            <li class="sidebar-label">
                {{ __("Save Filter") }}
            </li>
            <li class="list-filters list-link"></li>
        </div>
    </div>
</ul>`;frappe.templates.page=`<div class="pagecontainer mainpage">
    <div class="container page-body design-page-body">
        <div class="page-toolbar">
            <div class="container"></div>
        </div>
        <div class="page-wrapper">
            <div class="page-content">
                <div class="layout-side-section"></div>
                <div class="pagestandardbtns">
                    <div class="flex col page-actions justify-content-end ">
                        <!-- buttons -->
                        <div class="custom-actions hidden-xs hidden-md"></div>
                        <div class="standard-actions flex testing">
                            <span class="page-icon-group hidden-xs hidden-sm"></span>
                            <div class="menu-btn-group">
                                <button type="button" class="btn btn-default icon-btn" data-toggle="dropdown"
                                    aria-expanded="false">
                                    <span>
                                        <span class="menu-btn-group-label">
                                            <svg class="icon icon-sm">
                                                <use href="#icon-dot-horizontal">
                                                </use>
                                            </svg>
                                        </span>
                                    </span>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right submenutesting" role="menu"></ul>
                            </div>
                            <div class="actions-btn-group hide">
                                <button type="button" class="btn btn-primary btn-sm" data-toggle="dropdown"
                                    aria-expanded="false">
                                    <span>
                                        <span class="hidden-xs actions-btn-group-label">{%= __("Actions") %}</span>
                                        <svg class="icon icon-xs">
                                            <use href="#icon-select">
                                            </use>
                                        </svg>
                                    </span>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                </ul>
                            </div>
                            <button class="btn btn-primary btn-sm primary-action"></button>
                        </div>
                    </div>
                </div>
                <div class="workflow-button-area btn-group pull-right hide"></div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
    <div class="preloader">
        <div class="status"></div>
    </div>
</div>`;})();
//# sourceMappingURL=custom_desk.bundle.M4JR7VWH.js.map
