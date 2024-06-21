import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AccommodationPage() {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/accommodations/${id}`).then((response) => {
      setAccommodation(response.data);
    });
  }, []);

  if (!accommodation) return "";

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black  min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className=" text-3xl ">Photos of {accommodation.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className=" z-50 fixed right-4 top-3 flex gap-1 py-1 px-4 rounded-2xl bg-primary text-white shadow shadow-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
              Close Photos
            </button>
          </div>
          <div className="flex justify-center items-center ">
            <div className="grid grid-cols-2 gap-4   ">
              {accommodation?.photos?.length > 0 &&
                accommodation.photos.map((photo, index) => (
                  <div
                    key={photo}
                    className={`h-48 md:h-64 max-w-full   ${
                      index % 3 === 0 ? "md:col-span-2" : "col-span-1"
                    }`}
                  >
                    <img
                      className=" object-cover w-full max-h-full"
                      src={"http://localhost:4000/uploads/" + photo}
                      alt=""
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-4 bg-slate-100 bg-opacity-45 -mx-8 px-8 py-8 border-t
     border-black border-opacity-15 "
    >
      <h1 className="text-4xl lg:text-5xl ">{accommodation.title}</h1>
      <a
        className=" flex gap-1 my-5 text-xl lg:text-2xl font-semibold underline mt-6 "
        target="_blank"
        href={"https://www.google.com/maps/?q=" + accommodation.address}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 lg:size-9"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>

        {accommodation.address}
      </a>

      <div className="relative max-w-4xl mx-auto mb-4 lg:mb-6">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          <div>
            {accommodation.photos?.[0] && (
              <div className="flex">
                <img
                  className="aspect-square object-cover"
                  src={
                    "http://localhost:4000/uploads/" + accommodation.photos?.[0]
                  }
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid ">
            {accommodation.photos?.[1] && (
              <img
                className="aspect-square object-cover"
                src={
                  "http://localhost:4000/uploads/" + accommodation.photos?.[1]
                }
                alt=""
              />
            )}
            <div className="border overflow-hidden">
              {accommodation.photos?.[2] && (
                <img
                  className="aspect-square object-cover relative top-2"
                  src={
                    "http://localhost:4000/uploads/" + accommodation.photos?.[2]
                  }
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className=" flex gap-2 absolute bottom-2 right-2 py-2 px-4 
            bg-white rounded-2xl  shadow-md shadow-gray-700 text-black "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
          Show More Photos
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] ">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl  lg:text-4xl">Description</h2>
            <div className="lg:text-2xl mt-2">{accommodation.description}</div>
          </div>
          <div className="lg:text-2xl flex flex-col lg:flex-row lg:justify-between space-y-2 lg:space-y-0 lg:mr-4">
            <div>Check-in: {accommodation.checkin}</div>
            <div>Check-Out: {accommodation.checkout}</div>
            <div>Max Number of Guests: {accommodation.maxGuests}</div>
          </div>
          <div className=" mt-3 text-sm text-zinc-500 leading-4 lg:text-xl">
            {accommodation.extraInfo}
          </div>
        </div>
        <div>
          <div className="bg-white  ml-10 shadow p-4 rounded-2xl sm:h-full content-center">
            <div className="text-2xl text-center lg:text-4xl ">
              Price: ${accommodation.price} USD / Per Night
            </div>
            <div className="border rounded-2xl mt-4 ">
              <div className="flex">
                <div className=" py-3 px-4  lg:text-2xl">
                  <label>Check-in:</label>
                  <input className="bg-white" type="date" />
                </div>
                <div className="  py-3 px-4 border-l  lg:text-2xl">
                  <label>Check-out:</label>
                  <input className=" bg-white " type="date" />
                </div>
              </div>
            </div>
            <div className="  border  py-4 px-4 rounded-2xl lg:text-2xl">
              <label>Number of Guests:</label>
              <input className=" bg-white ml-3" type="number" value={1} />
            </div>
            <button className="primary mt-4 lg:text-2xl">
              Book this place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
