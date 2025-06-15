
import { $t } from './services/i18n.js';

export const AppMenus = {
    
	navbarTopRight: [],
	navbarTopLeft: [],
	navbarSideLeft: [
  {
    "to": "/home",
    "label": $t('home'),
    "icon": "pi pi-home",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/coursegrades",
    "label": $t('courseGrades'),
    "icon": "pi pi-check",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/certificates",
    "label": $t('certificates'),
    "icon": "pi pi-save",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/courses",
    "label": $t('courses'),
    "icon": "pi pi-book",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/certificatereviews",
    "label": $t('certificateReviews'),
    "icon": "pi pi-shield",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/users",
    "label": $t('users'),
    "icon": "pi pi-user-plus",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/permissions",
    "label": $t('permissions'),
    "icon": "pi pi-github",
    "iconcolor": "",
    "target": "",
    
  }
],
	reviewStatus: [    
{value: "待审核", label: $t('waiting')},
	{value: "审核通过", label: $t('pass')},
	{value: "审核拒绝", label: $t('fail')}
    ],
	certificateType: [    
{value: "公益类证书", label: $t('volunteer')},
	{value: "职业技能类证书", label: $t('occupation')},
	{value: "全国比赛类证书", label: $t('competition')}
    ],

    exportFormats: {
        print: {
			label: 'Print',
            icon: 'pi pi-print',
            type: 'print',
            ext: 'print',
        },
        pdf: {
			label: 'Pdf',
			
            icon: 'pi pi-file-pdf',
            type: 'pdf',
            ext: 'pdf',
        },
        excel: {
			label: 'Excel',
            icon: 'pi pi-file-excel',
            type: 'excel',
            ext: 'xlsx',
        },
        csv: {
			label: 'Csv',
            icon: 'pi pi-table',
            type: 'csv',
            ext: 'csv',
        },
    },
    locales: {
  "fr": "French",
  "ru": "Russian",
  "zh-CN": "Chinese",
  "en-US": "English",
  "it": "Italian",
  "hi": "Hindi",
  "pt": "Portuguese",
  "de": "German",
  "es": "Spanish",
  "ar": "Arabic"
}
}