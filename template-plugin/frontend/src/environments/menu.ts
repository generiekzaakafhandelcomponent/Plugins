import { MenuConfig, ROLE_ADMIN, ROLE_DEVELOPER, ROLE_USER } from "@valtimo/config"

const menuConfig: MenuConfig = {
    menuItems: [
        {
            roles: [ROLE_USER],
            link: ['/'],
            title: 'Dashboard',
            iconClass: 'icon mdi mdi-view-dashboard',
            sequence: 0,
        },
        {
            roles: [ROLE_USER],
            title: 'Dossiers',
            iconClass: 'icon mdi mdi-layers',
            sequence: 1,
            children: [],
        },
        {
            roles: [ROLE_ADMIN],
            title: 'Admin',
            iconClass: 'icon mdi mdi-tune',
            sequence: 2,
            children: [
                {title: 'Basics', textClass: 'text-dark font-weight-bold c-default', sequence: 1},
                {link: ['/processes'], title: 'Processes', sequence: 2},
                {link: ['/form-management'], title: 'Forms', sequence: 3},
                {link: ['/dossier-management'], title: 'Dossiers', sequence: 4},
                {link: ['/plugins'], title: 'Plugins', sequence: 5},
                {link: ['/form-links'], title: 'Form links', sequence: 6},
                {link: ['/process-links'], title: 'Form links Plugin', sequence: 7},
            ],
        },
    ],
}

export {menuConfig}
