
import './icons.css';


/* Icone de ficheiro TCC*/
export const FileIcon = () => (
  <svg className='imgFile' viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className='imgFile' width="40px" height="40px" viewBox="0 0 24 24" fill="none">
    <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

);


export const FileIconMini = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
)


/*######## icones dos cards do Dashboard ############*/

export const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" stroke="var(--fundo-escuro)">

    <g id="SVGRepo_bgCarrier" stroke-width="0" />

    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

    <g id="SVGRepo_iconCarrier"> <path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21" stroke="#000000" stroke-width="1.512" stroke-linecap="round" stroke-linejoin="round" /> </g>

  </svg>

)

export const InsertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="iconCard" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <line x1="12" x2="12" y1="19" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
)

export const GraficIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 2">
    <defs><clipPath id="clip-path">
      <rect class="cls-1" width="24" height="24" />
    </clipPath>
    </defs>
    <title>shelf</title>

    <g class="cls-2">
      <path d="M20.15,20.24H3.85a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h16.3a1,1,0,0,1,1,1V19.24A1,1,0,0,1,20.15,20.24Zm-15.3-2h14.3V4H4.85Z" />
      <path d="M12,20.24a1,1,0,0,1-1-1V3a1,1,0,1,1,2,0V19.24A1,1,0,0,1,12,20.24Z" />
      <path d="M20.15,12.09H3.85a1,1,0,1,1,0-2h16.3a1,1,0,0,1,0,2Z" />
      <path d="M6.51,22.05a1,1,0,0,1-1-1V19.24a1,1,0,0,1,2,0v1.81A1,1,0,0,1,6.51,22.05Z" />
      <path d="M17.49,22.05a1,1,0,0,1-1-1V19.24a1,1,0,0,1,2,0v1.81A1,1,0,0,1,17.49,22.05Z" />
      <path d="M14.23,12.09a1,1,0,0,1-1-1V5.66a1,1,0,0,1,2,0v5.43A1,1,0,0,1,14.23,12.09Z" />
      <path d="M17.92,12.1a1,1,0,0,1-1-.71l-1.4-4.53a1,1,0,1,1,1.91-.59l1.4,4.53a1,1,0,0,1-.66,1.25A1,1,0,0,1,17.92,12.1Z" />
      <path d="M9.28,20.24a1,1,0,0,1-1-1V13.81a1,1,0,0,1,2,0v5.43A1,1,0,0,1,9.28,20.24Z" />
    </g>

  </svg>

)


/*###### icones do Sidebar*/
// https://www.svgrepo.com/

export const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="var(--fundo-claro)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

)


export const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>

)

export const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)


export const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
)



export const RegistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" x2="12" y1="18" y2="12" />
    <line x1="9" x2="15" y1="15" y2="15" />
  </svg>
)

export const Statistics = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24px" width="24px" version="1.1" id="Capa_1" viewBox="0 0 494.938 494.938" >
    <g>
      <path d="M469.375,445.01H25.567c-13.801,0-24.966,11.173-24.966,24.965c0,13.789,11.165,24.963,24.966,24.963h443.808   c13.78,0,24.961-11.174,24.961-24.963C494.336,456.183,483.155,445.01,469.375,445.01z" />
      <path d="M50.221,241.837c-5.557,0-10.074,4.519-10.074,10.085V401.64c0,5.566,4.518,10.086,10.074,10.086h58.886   c5.571,0,10.091-4.52,10.091-10.086V251.922c0-5.566-4.52-10.085-10.091-10.085H50.221z" />
      <path d="M375.761,82.027V401.64c0,5.566,4.52,10.086,10.075,10.086h58.901c5.556,0,10.075-4.52,10.075-10.086V82.027   c0-5.566-4.52-10.086-10.075-10.086h-58.901C380.28,71.941,375.761,76.461,375.761,82.027z" />
      <path d="M273.969,161.045c-5.57,0-10.09,4.52-10.09,10.086V401.64c0,5.566,4.519,10.086,10.09,10.086h58.886   c5.557,0,10.075-4.52,10.075-10.086V171.131c0-5.566-4.519-10.086-10.075-10.086H273.969z" />
      <path d="M162.103,286.386c-5.571,0-10.091,4.517-10.091,10.084v105.17c0,5.566,4.52,10.086,10.091,10.086h58.87   c5.572,0,10.092-4.52,10.092-10.086V296.47c0-5.567-4.52-10.084-10.092-10.084H162.103z" />
    </g>
  </svg>
)

export const CatalogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>

)

export const LogRegistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="var(--fundo-claro)" width="24px" height="24px" viewBox="0 0 16 16" id="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
    <path id="Path_184" data-name="Path 184" d="M57.5,41a.5.5,0,0,0-.5.5V43H47V31h2v.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V31h2v.5a.5.5,0,0,0,1,0v-1a.5.5,0,0,0-.5-.5H55v-.5A1.5,1.5,0,0,0,53.5,28h-3A1.5,1.5,0,0,0,49,29.5V30H46.5a.5.5,0,0,0-.5.5v13a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-2A.5.5,0,0,0,57.5,41ZM50,29.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V31H50Zm11.854,4.646-2-2a.5.5,0,0,0-.708,0l-6,6A.5.5,0,0,0,53,38.5v2a.5.5,0,0,0,.5.5h2a.5.5,0,0,0,.354-.146l6-6A.5.5,0,0,0,61.854,34.146ZM54,40V38.707l5.5-5.5L60.793,34.5l-5.5,5.5Zm-2,.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1,0-1h2A.5.5,0,0,1,52,40.5Zm0-3a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1,0-1h2A.5.5,0,0,1,52,37.5ZM54.5,35h-5a.5.5,0,0,1,0-1h5a.5.5,0,0,1,0,1Z" transform="translate(-46 -28)" />
  </svg>

)

export const ManagementUserIcon = () => (
  <svg width="28px" height="28px" fill="currentColor" version="1.1" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1251_98416)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z"  />
      <path d="M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z"  />
      <path d="M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z"  />
      <path d="M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z"  />
    </g>
    <defs>
      <clipPath id="clip0_1251_98416">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>

)


export const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" >
    <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="var(--cor-primaria)" stroke-width="1.5" stroke-linecap="round" />
    <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="var(--cor-primaria)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)


/* ########### Icone de 'Pesquisa não encontrada' #########*/

export const SearchNotFoundIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 -0.5 25 25" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 11.493C5.50364 8.39226 7.69698 5.72579 10.7388 5.12416C13.7807 4.52253 16.8239 6.15327 18.0077 9.0192C19.1915 11.8851 18.186 15.1881 15.6063 16.9085C13.0265 18.6288 9.59077 18.2874 7.4 16.093C6.18148 14.8725 5.49799 13.2177 5.5 11.493Z" stroke="var(--fundo-escuro)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M16.062 16.568L19.5 19.993" stroke="var(--fundo-escuro)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.5303 8.96271C10.2374 8.66982 9.76256 8.66982 9.46967 8.96271C9.17678 9.25561 9.17678 9.73048 9.46967 10.0234L10.5303 8.96271ZM11.4697 12.0234C11.7626 12.3163 12.2374 12.3163 12.5303 12.0234C12.8232 11.7305 12.8232 11.2556 12.5303 10.9627L11.4697 12.0234ZM12.5303 10.9627C12.2374 10.6698 11.7626 10.6698 11.4697 10.9627C11.1768 11.2556 11.1768 11.7305 11.4697 12.0234L12.5303 10.9627ZM13.4697 14.0234C13.7626 14.3163 14.2374 14.3163 14.5303 14.0234C14.8232 13.7305 14.8232 13.2556 14.5303 12.9627L13.4697 14.0234ZM12.5303 12.0234C12.8232 11.7305 12.8232 11.2556 12.5303 10.9627C12.2374 10.6698 11.7626 10.6698 11.4697 10.9627L12.5303 12.0234ZM9.46967 12.9627C9.17678 13.2556 9.17678 13.7305 9.46967 14.0234C9.76256 14.3163 10.2374 14.3163 10.5303 14.0234L9.46967 12.9627ZM11.4697 10.9627C11.1768 11.2556 11.1768 11.7305 11.4697 12.0234C11.7626 12.3163 12.2374 12.3163 12.5303 12.0234L11.4697 10.9627ZM14.5303 10.0234C14.8232 9.73048 14.8232 9.25561 14.5303 8.96271C14.2374 8.66982 13.7626 8.66982 13.4697 8.96271L14.5303 10.0234ZM9.46967 10.0234L11.4697 12.0234L12.5303 10.9627L10.5303 8.96271L9.46967 10.0234ZM11.4697 12.0234L13.4697 14.0234L14.5303 12.9627L12.5303 10.9627L11.4697 12.0234ZM11.4697 10.9627L9.46967 12.9627L10.5303 14.0234L12.5303 12.0234L11.4697 10.9627ZM12.5303 12.0234L14.5303 10.0234L13.4697 8.96271L11.4697 10.9627L12.5303 12.0234Z" fill="var(--fundo-escuro)" />
  </svg>
)



/* ######## Icone de "cancelar mais de um autor" em Register.jsx ####### */
export const CancelAuthor = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
    <path d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="var(--cor-primaria)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)


/*##### Icone de Deletar RELATÓRIO  #####*/
export const DeleteTcc = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
    <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)


/*##### Icone de editar RELATÓRIO  #####*/


export const EditTcc = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
    <path opacity="0" d="M4 20H8L18 10L14 6L4 16V20Z" fill="#fff" />
    <path d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)