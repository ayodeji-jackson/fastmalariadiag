import { useDropzone } from 'react-dropzone'
import './App.css';
import { FormEvent, useState } from 'react';
import { formatBytes } from './helpers';

const UploadIcon = () => <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M32.5 32L24.5 24L16.5 32" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M24.5 24V42" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M41.28 36.78C43.2307 35.7166 44.7717 34.0338 45.6598 31.9973C46.5479 29.9608 46.7325 27.6865 46.1845 25.5334C45.6364 23.3803 44.387 21.4711 42.6334 20.1069C40.8797 18.7428 38.7218 18.0015 36.5 18H33.98C33.3747 15.6585 32.2464 13.4847 30.6799 11.642C29.1135 9.79933 27.1497 8.33573 24.9362 7.36124C22.7227 6.38676 20.3171 5.92675 17.9003 6.01579C15.4834 6.10484 13.1182 6.74063 10.9824 7.87536C8.84662 9.01009 6.99586 10.6142 5.56929 12.5672C4.14271 14.5202 3.17742 16.7711 2.746 19.1508C2.31458 21.5305 2.42825 23.9771 3.07847 26.3066C3.72869 28.636 4.89853 30.7878 6.50004 32.6" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M32.5 32L24.5 24L16.5 32" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>;

const ImageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.75299 10.5C10.0485 10.5 10.341 10.4418 10.614 10.3287C10.887 10.2157 11.135 10.0499 11.344 9.84099C11.5529 9.63206 11.7186 9.38402 11.8317 9.11104C11.9448 8.83806 12.003 8.54547 12.003 8.25C12.003 7.95453 11.9448 7.66194 11.8317 7.38896C11.7186 7.11598 11.5529 6.86794 11.344 6.65901C11.135 6.45008 10.887 6.28434 10.614 6.17127C10.341 6.0582 10.0485 6 9.75299 6C9.15625 6 8.58396 6.23705 8.162 6.65901C7.74004 7.08097 7.50299 7.65326 7.50299 8.25C7.50299 8.84674 7.74004 9.41903 8.162 9.84099C8.58396 10.2629 9.15625 10.5 9.75299 10.5Z" fill="#0F91D2"/>
<path d="M21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75V21ZM6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V18L7.836 14.664C7.95422 14.5461 8.10843 14.4709 8.27417 14.4506C8.43992 14.4302 8.60773 14.4657 8.751 14.5515L12 16.5L15.2355 11.97C15.2988 11.8815 15.3806 11.8078 15.4753 11.754C15.5699 11.7003 15.6751 11.6678 15.7836 11.6588C15.8921 11.6498 16.0012 11.6645 16.1034 11.702C16.2056 11.7394 16.2985 11.7986 16.3755 11.8755L19.5 15V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6Z" fill="#0F91D2"/>
</svg>;

const TARGET_CLASSES = ['uninfected', 'parasitised'];

declare global {
  interface Window {
    tf: any
  }
}

const Result = (props: { probability: number, className: string, src: string }) => {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className='max-w-[1010px] w-[1010px] bg-white m-auto rounded-xl py-48'>
      <div className='mx-auto w-fit text-center flex gap-5 flex-col'>
        <h1 className='text-2xl mb-4'>Success!</h1>
        <p className='max-w-96 mx-auto'>The analysis has been completed, click the button below to obtain results</p>
        <button onClick={() => setShowResults(true)} className={`py-3 px-6 text-[#0F91D2] border w-fit mx-auto border-black/10 rounded-[5px] bg-white${showResults ? ' hidden' : ' block'}`}>View Results</button>
        {
          showResults &&
          <>
            <img src={props.src} className='max-w-full w-[96px] h-[96px] mx-auto' />
            <p>Predicted class probabilities for image1: [{props.probability}]</p>
            <p>Predicted class for image1: [{props.className}]</p>
          </>
        }
      </div>
    </div>
  )
};

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (file: File[]) => setUploadedFiles(prev => [...prev, ...file]), 
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }, 
    maxSize: 1000000, 
    onDragEnter: () => setIsDragActive(true), 
    onDragLeave: () => setIsDragActive(false), 
    onDropAccepted: () => setIsDragActive(false), 
    onDropRejected: () => setIsDragActive(false)
  });
  const [src, setSrc] = useState('');
  const [probability, setProbability] = useState(0);
  const [className, setClassName] = useState<'uninfected' | 'parasitised'>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(window.tf);
    const url = URL.createObjectURL(uploadedFiles[0]);
    const img = new Image();
    img.src = url;
    setSrc(url);
    
    const model = await window.tf.loadLayersModel('/model.json');

    const tensor = window.tf.browser
      .fromPixels(img)
      .resizeNearestNeighbor([96, 96]) // change the image size here
      .toFloat()
      .div(window.tf.scalar(255.0))
      .expandDims();

    const predictions = await model.predict(tensor).data();
    const top5 = Array.from(predictions)
      .map(function (p, i) {
        // this is Array.map
        return {
          probability: p,
          className: TARGET_CLASSES[i],
        };
      })
      .sort(function (a: any, b: any) {
        return b.probability - a.probability;
      })
      .slice(0, 2);

    setProbability(top5[0].probability as number);
    setClassName(top5[0].className as 'uninfected' | 'parasitised');
  };

  return (
    <div className='h-screen bg-[#EBEBEB] flex'>
      {
        probability && className && src ? 
        <Result probability={probability} className={className} src={src} /> :
        <form className='max-w-[1010px] w-[1010px] bg-white m-auto rounded-xl' onSubmit={onSubmit}>
          <div className='mx-auto w-fit'>
            <div className={`pt-16 text-center${uploadedFiles.length ? ' pb-5' : ' pb-[22px]'}`}>
              <h1 className='text-xl mb-4'>Analyze your Blood Cells Images</h1>
              <p className='mb-11 text-sm'>Upload the necessary image file for analysis and get the result in a PDF format</p>
              <span className={`border-dashed rounded-[10px] flex gap-6 items-center border${!uploadedFiles.length ? ' flex-col py-14' : ' py-4 text-left pl-8 pr-6'}${!isDragActive ? ' bg-white' : ' bg-[#0F91D2]/5'}`} {...getRootProps()}>
                <span className='mx-auto block w-fit'><UploadIcon /></span>
                <div className={`space-y-3${uploadedFiles.length ? ' max-w-[252px]' : ''}`}>
                  <p className='text-sm'>Select a file or drag and drop here</p>
                  <p className='text-xs text-[#000]/40'>JPG, PNG or JPEG, file size no more than 1MB</p>
                </div>
                <button type='button' className='h-min border border-[#0F91D2]/70 text-[#0F91D2]/70 text-[10px] rounded-md py-3 px-4'>SELECT FILE</button>
                <input hidden {...getInputProps()} />
              </span>
            </div>
            {
              uploadedFiles.length ? 
              <div>
                <h2 className='text-sm mb-8'>File added</h2>
                <ul className='flex flex-col gap-8 h-56 overflow-y-auto'>
                  {
                    uploadedFiles.map(file => 
                      <li key={file.name} className='flex gap-4 items-center'>
                        <ImageIcon /><label className='text-xs'>{file.name}</label>{' '}<span className='text-[10px] ml-auto'>{formatBytes(file.size, 0)}</span>
                      </li>
                    )
                  }
                </ul>
              </div>
              : null
            }
          </div>
          <div className='bg-[#FBFDFE] py-5 px-14 gap-2 flex'>
            <button type='button' className='ml-auto py-3 px-6 bg-white rounded-[5px]'>Cancel</button>
            <button disabled={uploadedFiles.length <= 0} className='py-3 px-6 text-[#0F91D2] disabled:text-black/30 border border-black/10 rounded-[5px] bg-white'>Upload</button>
          </div>
        </form>
      }
    </div>
  )
}

export default App
