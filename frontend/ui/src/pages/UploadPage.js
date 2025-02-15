import React, { useContext } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { ImageContext } from "../context/imageContext";
import { Hourglass } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentsContext } from "../context/fetchStudentcontext";
import compressImage from "../utils/compressImage";

const UploadPage = () => {
	const {
		imagesArray,
		setImagesArray,
		setIsLoading,
		setDetectedFaces,
		setforwardImages,
		setImageLinks,
	} = useContext(ImageContext);
	const { loading } = useContext(StudentsContext);

	const notifySuccess = () => {
		toast.success("Faces detected successfully 😊");
	};

	const notifyError = () => {
		toast.error("Error in detecting faces 😞");
	};

	const notifymsg = () => {
		toast.warn("No images selected for preview detection.");
	};

	const handleFileChange = async (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files);

			// Compress each selected image before adding to the state
			const compressedImages = [];
			for (let file of files) {
				const compressed = await compressImage(file); // Compress the image
				compressedImages.push(compressed); // Store compressed images in an array
			}

			// Update state with compressed images
			setImagesArray((prevFiles) => [
				...(prevFiles || []),
				...compressedImages,
			]);
		} else {
			console.error("No files selected");
		}
	};

	// This triggers the click event of input field when the user clicks on image
	const handleClickFileInput = (e) => {
		document.getElementById("fileInput").click();
	};

	const handleClickCameraInput = (e) => {
		document.getElementById("cameraInput").click();
	};

	const handleDeleteImages = (index) => {
		setImagesArray(imagesArray.filter((_, ind) => ind !== index));
	};

	// console.log(imagesArray);

	if (!Array.isArray(imagesArray)) {
		return <div>Images array is not available.</div>;
	}

	const handlePreviewDetection = async () => {
		setIsLoading(true);
		try {
			if (imagesArray.length === 0) {
				//TODO: Show a toast message instead of alert
				notifymsg();
				// alert("No images selected for preview detection.");
				return;
			}

			//Declaring here so that when this function called again , new folder will be created
			const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
			const folderName = `uploadedImages/${timestamp}`;

			const uploadPromises = imagesArray.map(async (file) => {
				const formData = new FormData();
				formData.append("file", file);
				formData.append(
					"upload_preset",
					process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
				);

				formData.append("folder", folderName); // Adjust the folder name as needed

				const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
				return axios.post(
					`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
					formData
				);
			});

			// Wait for all images to upload and retrieve their URLs
			const uploadResponses = await Promise.all(uploadPromises);
			const urls = uploadResponses.map((res) => res.data.secure_url);

			// console.log(urls);
			setImageLinks(urls);

			//Step 2: Send the array of image URLs to your backend
			const response = await axios.post(
				"/api/previewImages/fetch_preview_images/",
				{ urls }, // send image URLs as the payload
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			notifySuccess();
			// Handle the response from the backend
			setforwardImages(imagesArray);
			setImagesArray([]);
			console.log(response.data);
			setDetectedFaces(response.data.results);
		} catch (error) {
			console.error(error);
			notifyError();
			// alert("Error in preview detection");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<div className="flex flex-col justify-center min-h-screen items-center">
					<Hourglass
						visible={true}
						height="80"
						width="80"
						ariaLabel="hourglass-loading"
						wrapperStyle={{}}
						wrapperClass=""
						colors={["#3949ab", "#667eea"]}
					/>
					<h1 className="text-2xl font-bold text-center mt-5">
						Fetching students...
					</h1>
				</div>
			) : (
				<div>
					<div className="flex flex-col container mx-auto gap-5 md:p-12 ">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10  md:mt-20 p-6">
							{/* First Option */}
							<div className="border p-4 rounded-2xl shadow-lg  shadow-indigo-400">
								<div className="mb-4">
									<h1 className="text-2xl font-bold mb-4 mt-3 text-center">
										Upload Images
									</h1>
									<input
										id="fileInput"
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										style={{ display: "none" }}
										className="border rounded-md p-2 w-full"
										multiple
									/>
									<div
										className="icon p-10"
										onClick={handleClickFileInput}
									>
										<div className="p-10 flex justify-center border-4 border-indigo-500 border-dashed rounded-lg">
											<img
												src="/images/uploadImage.png"
												alt="upload-excel-file"
												className="w-30 h-20"
											/>
										</div>
									</div>

									{/* {imagesArray.length > 0 && (
                <div className="file-names p-4">
                  <div className="font-bold">
                    <h3 className="text-center">Selected Files</h3>
                  </div>
                  <ul className="mt-4">
                    <div className="flex flex-col gap-2">
                      {imagesArray.map((file, index) => (
                        <div className="flex border p-2 rounded-md shadow-md shadow-indigo-300 items-center justify-between">
                          <li key={index} className="truncate">
                            {file.name}
                          </li>
                          <button
                            className="text-white bg-red-500 rounded-full p-1 cursor-pointer"
                            onClick={() => handleDeleteImages(index)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ul>
                </div>
              )} */}
								</div>
							</div>

							{/* Second Option */}
							<div className="border p-4 rounded-2xl shadow-lg  shadow-indigo-400">
								<div className="mb-4">
									<h1 className="text-2xl font-bold mb-4 mt-3 text-center">
										Click Images
									</h1>
									<input
										id="cameraInput"
										type="file"
										accept="images/*"
										onChange={handleFileChange}
										style={{ display: "none" }}
										className="border rounded-md p-2 w-full"
										capture="environment"
									/>
									<div
										className="icon p-10"
										onClick={handleClickCameraInput}
									>
										<div className="p-10 flex justify-center border-4 border-indigo-500 border-dashed rounded-lg">
											<img
												src="/images/clickPhoto.png"
												alt="upload-excel-file"
												className="w-30 h-20"
											/>
										</div>
									</div>
								</div>
							</div>
							{imagesArray.length > 0 && (
								<div className="file-names p-4">
									<div className="font-bold">
										<h3 className="text-center">
											Selected Files
										</h3>
									</div>
									<ul className="mt-4">
										<div className="flex flex-col gap-2">
											{imagesArray.map((file, index) => (
												<div
													key={index}
													className="flex border p-2 rounded-md shadow-md shadow-indigo-300 items-center justify-between"
												>
													<li
														key={index}
														className="truncate"
													>
														{file.name}
													</li>
													<button
														className="text-white bg-red-500 rounded-full p-1 cursor-pointer"
														onClick={() =>
															handleDeleteImages(
																index
															)
														}
													>
														<MdDelete />
													</button>
												</div>
											))}
										</div>
									</ul>
								</div>
							)}
						</div>

						<div className="flex justify-center">
							<Link to={"/previewDetection"}>
								<button
									onClick={handlePreviewDetection}
									className="mt-12 mb-10 bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-1 hover:bg-indigo-700"
								>
									Preview Detections
								</button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default UploadPage;
