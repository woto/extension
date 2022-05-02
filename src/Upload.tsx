import React from "react";
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

const Upload = (props: {entityImage: any, setEntityImage: any}) => (
    <Uploady destination={{ url: "https://55f2-89-113-92-83.ngrok.io/upload" }}>
        <UploadButton/>
    </Uploady>
);

export default Upload;


// import React from 'react'
// import Uppy from '@uppy/core'
// import Tus from '@uppy/tus'
// import { DragDrop } from '@uppy/react'

// export default function Fuck(props: {entityImage: any, setEntityImage: any}) {

//   const uppy = new Uppy({
//     debug: true,
//     meta: { type: 'avatar' },
//     restrictions: { maxNumberOfFiles: 1 },
//     autoProceed: true,
//   })
  
//   uppy.use(Tus, { endpoint: 'https://55f2-89-113-92-83.ngrok.io/upload' })
  
//   uppy.on('complete', (result) => {
//     debugger
//     const url = result.successful[0].uploadURL
//     props.setEntityImage(url);
//   //   store.dispatch({
//   //     type: 'SET_USER_AVATAR_URL',
//   //     payload: { url },
//   //   })
//   })

//   return (
//     <div>
//       <img src={props.entityImage} />
//       <DragDrop
//         uppy={uppy}
//         locale={{
//           strings: {
//             // Text to show on the droppable area.
//             // `%{browse}` is replaced with a link that opens the system file selection dialog.
//             dropHereOr: 'Drop here or %{browse}',
//             // Used as the label for the link that opens the system file selection dialog.
//             browse: 'browse',
//           },
//         }}
//       />
//     </div>
//   )
// }

// // export default AvatarPicker;