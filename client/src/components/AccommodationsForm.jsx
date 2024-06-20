import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";

export default function AccommodationsForm() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/accommodations/" + id)
      .then((response) => {
        const { data } = response;
        if (data) {
          setTitle(data.title);
          setAddress(data.address);
          setAddedPhotos(data.photos);
          setDescription(data.description);
          setSelectedPerks(data.perks);
          setExtraInfo(data.extraInfo);
          setCheckIn(data.checkin);
          setCheckOut(data.checkout);
          setMaxGuests(data.maxGuests);
        } else {
          setTitle("");
          setAddress("");
          setAddedPhotos([]);
          setDescription("");
          setSelectedPerks([]);
          setExtraInfo("");
          setCheckIn("");
          setCheckOut("");
          setMaxGuests(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching accommodation data:", error);
      });
  }, [id]);

  const isValidTimeFormat = (time) => {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    if (!photoLink) {
      console.warn("No link provided.");
      return;
    }
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      setAddedPhotos((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => [...prev, ...filenames]);
      })
      .catch((error) => {
        console.error("There was an error uploading the photos!", error);
      });
  }

  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      setSelectedPerks((prev) => [...prev, name]);
    } else {
      setSelectedPerks((prev) =>
        prev.filter((selectedName) => selectedName !== name)
      );
    }
  }

  function removePhoto(ev ,filename) {
    ev.preventDefault()
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  function selectAsMainPhoto(ev ,filename) {
    ev.preventDefault()
    const addedPhotosWithoutSelected = addedPhotos.
        filter(photo => photo !== filename);
    const newAddedPhoto = [filename, ... addedPhotosWithoutSelected];
    setAddedPhotos(newAddedPhoto);
  }

  const saveAccommodation = async (ev) => {
    ev.preventDefault();

    if (!isValidTimeFormat(checkIn)) {
      alert("Please write the check-in/out hour in HH:mm (24 hours) format.");
      return;
    }

    if (!isValidTimeFormat(checkOut)) {
      alert("Please write the check-in/out hour in HH:mm (24 hours) format.");
      return;
    }

    if (id) {
      await axios.put("/accommodations", {
        id,
        title,
        address,
        addedPhotos,
        description,
        selectedPerks,
        extraInfo,
        checkin: checkIn,
        checkout: checkOut,
        maxGuests,
      });
      setRedirect(true);
    } else {
      await axios.post("/accommodations", {
        title,
        address,
        addedPhotos,
        description,
        selectedPerks,
        extraInfo,
        checkin: checkIn,
        checkout: checkOut,
        maxGuests,
      });
      setRedirect(true);
    }
  };

  const handleCancel = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={"/account/accommodations"} />;
  }

  return (
    <div>
      <AccountNav />
      <form>
        <h2 className="text-2xl mt-4 ">Title</h2>
        <p className="text-gray-500 text-sm">
          This title will be visible in the app so make sure you pick a good
          one!
        </p>
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Title , for example: My home"
        />
        <h2 className="text-2xl mt-4 ">Address</h2>
        <p className="text-gray-500 text-sm">The address of this place</p>
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="Address"
        />
        <h2 className="text-2xl mt-4 ">Photos</h2>
        <p className="text-gray-500 text-sm">
          This will be the photos that the rest of users will see. The more
          photos you upload the better are the chances of renting it!
        </p>
        <div className="flex">
          <input
            type="text"
            value={photoLink}
            onChange={(ev) => setPhotoLink(ev.target.value)}
            placeholder={"Add using a link....jpg"}
          />
          <button
            onClick={addPhotoByLink}
            className="bg-gray-300 px-4 rounded-full"
          >
            Add&nbsp;photo
          </button>
        </div>
        <div className="grid mt-2 gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link) => (
              <div key={link} className="h-32 flex relative">
                <img
                  className="rounded-2xl w-full object-cover"
                  src={`http://localhost:4000/uploads/${link}`}
                  alt=""
                />
                <button
                  onClick={ev => removePhoto(ev ,link)}
                  className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  onClick={ev => selectAsMainPhoto(ev , link)}
                  className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3  "
                >
                  {link === addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {link !== addedPhotos[0] &&(
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                  )}
                </button>
              </div>
            ))}
          <label className="h-32 cursor-pointer flex items-center justify-around border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input
              type="file"
              multiple={true}
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            Upload
          </label>
        </div>
        <h2 className="text-2xl mt-4 ">Description</h2>
        <p className="text-gray-500 text-sm">
          A small description of the place.
        </p>
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <h2 className="text-2xl mt-4 ">Perks</h2>
        <p className="text-gray-500 text-sm">
          Select all the perks of your place
        </p>
        <div className="grid mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <label className="border p-4 flex rounded-2xl gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedPerks.includes("wifi")}
              name="wifi"
              onChange={handleCbClick}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
              />
            </svg>
            <span>Wifi</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedPerks.includes("parking")}
              name="parking"
              onChange={handleCbClick}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>

            <span>Free Parking Spot</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedPerks.includes("tv")}
              name="tv"
              onChange={handleCbClick}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>

            <span>TV</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedPerks.includes("pets")}
              name="pets"
              onChange={handleCbClick}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>

            <span>Pets Allowed</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedPerks.includes("privateEntrance")}
              name="privateEntrance"
              onChange={handleCbClick}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <span>Private Entrance</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedPerks.includes("Security")}
              name="Security"
              onChange={handleCbClick}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>

            <span>Security</span>
          </label>
        </div>
        <h2 className="text-2xl mt-4 ">Extra info</h2>
        <p className="text-gray-500 text-sm">House rules, etc</p>
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        <h2 className="text-2xl mt-4 ">Check in &amp; out times</h2>
        <p className="text-gray-500 text-sm">
          Add check in and out times, remember to have some time window for
          cleaning the room between guests
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="22:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
        </div>
        <div className="flex">
          <button
            onClick={handleCancel}
            className="bg-gray-300 p-2 w-full text-black rounded-2xl my-4"
          >
            Cancel
          </button>
          <button onClick={saveAccommodation} className="primary my-4">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
