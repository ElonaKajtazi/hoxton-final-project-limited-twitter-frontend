import { UserType } from "../types";

type Props = {
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setChangePic: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ChangeProfilePictureForm({
  currentUser,
  setCurrentUser,
  setChangePic,
}: Props) {
  if (!currentUser) return <h1>Loading</h1>;
  return (
    <div className="sign-in-modal__wrapper ">
      <div className="sign-in-modal__container">
        <button
          className="sign-in-modal__close-button"
          onClick={() => {
            setChangePic(false);
          }}
        >
          X
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetch(`http://localhost:4443/users/${currentUser.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                avatar: e.target.avatar.value,
              }),
            })
              .then((rsp) => rsp.json())
              .then((data) => setCurrentUser(data));

            setChangePic(false);
          }}
        >
          <h2 className="title">Change profile picture</h2>
          <input
            type="text"
            name="avatar"
            className="text-input"
            placeholder="image url"
            required
          />
          <button className="sign-in-btn">Change</button>
        </form>
      </div>
    </div>
  );
}
