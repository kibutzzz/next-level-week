import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import "./styles.css";
import { FiUpload } from 'react-icons/fi';

interface Props {
  onFileSelected: (file: File) => void
}

const Dropzone: React.FC<Props> = ({onFileSelected}) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("")

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileSelected(file);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*"
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {
        selectedFileUrl
          ? <img src={selectedFileUrl} alt="Imagem do estabeleciomento" />
          : isDragActive ?
            <p>Largue o arquivo aqui...</p> :
            <p>
              <FiUpload />
            Arraste e solte uma imagem do estabeleciomento aqui ou clique para selecionar
          </p>
      }
    </div>
  )
}

export default Dropzone;