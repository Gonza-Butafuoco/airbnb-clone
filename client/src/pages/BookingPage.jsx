import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";

export default function BookingPage() {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black  min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className=" text-3xl ">
              Photos of {booking.accommodation.title}
            </h2>
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
              {booking.accommodation?.photos?.length > 0 &&
                booking.accommodation.photos.map((photo, index) => (
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
    <div className="mt-4 bg-slate-100 bg-opacity-45 -mx-8 px-8 py-8 border-t
    border-black border-opacity-15 ">
      <div>
        <h1 className="text-4xl lg:text-5xl ">{booking.accommodation.title}</h1>
        <a
          className=" flex gap-1 my-5 text-xl lg:text-2xl font-semibold underline mt-6 "
          target="_blank"
          href={
            "https://www.google.com/maps/?q=" + booking.accommodation.address
          }
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

          {booking.accommodation.address}
        </a>
      </div>
      <div className="bg-gray-300 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Your Booking Information :</h2>
          <div className="flex items-center gap-2 pt-2 pb-1 text-xl lg:text-2xl">
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
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
            {differenceInCalendarDays(
              new Date(booking.checkOut),
              new Date(booking.checkIn)
            )}{" "}
            Nights :
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
            {format(new Date(booking.checkIn), "yyyy-MM-dd")}
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
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
            {format(new Date(booking.checkOut), "yyyy-MM-dd")}
          </div>
        </div>
          <div className="bg-primary p-4 text-white rounded-2xl">
            <div className="text-xl">Total Price</div>
            <div className="text-3xl">${booking.price} USD</div>
          </div>
      </div>
      <div className="relative max-w-4xl mx-auto mb-4 lg:mb-6">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          <div>
            {booking.accommodation.photos?.[0] && (
              <div className="flex">
                <img
                  className="aspect-square object-cover"
                  src={
                    "http://localhost:4000/uploads/" +
                    booking.accommodation.photos?.[0]
                  }
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid ">
            {booking.accommodation.photos?.[1] && (
              <img
                className="aspect-square object-cover"
                src={
                  "http://localhost:4000/uploads/" +
                  booking.accommodation.photos?.[1]
                }
                alt=""
              />
            )}
            <div className="border overflow-hidden">
              {booking.accommodation.photos?.[2] && (
                <img
                  className="aspect-square object-cover relative top-2"
                  src={
                    "http://localhost:4000/uploads/" +
                    booking.accommodation.photos?.[2]
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
    </div>
  );
}
