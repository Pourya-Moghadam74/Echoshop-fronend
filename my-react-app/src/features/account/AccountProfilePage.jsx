import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserAddresses, updateUserAddresses } from "../user/userSlice";

function AccountProfilePage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
    const addresses = useSelector((state) => state.user.addresses.results);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchUserAddresses());
  }, [dispatch]);

  // Populate formData when addresses load
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const addr = addresses[0]; // assuming first address
      setFormData({
        full_name: addr.full_name || "",
        street_address: addr.street_address || "",
        city: addr.city || "",
        postal_code: addr.postal_code || "",
        country: addr.country || "",
      });
    }
  }, [addresses]);

  // Update formData on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUserAddresses(formData));
    setIsEditing(false);
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Account Profile</h2>
      <form className="card p-4" style={{ maxWidth: 600 }}>
        {[
          { label: "Full Name", name: "full_name" },
          { label: "Street Address", name: "street_address" },
          { label: "City", name: "city" },
          { label: "Postal Code", name: "postal_code" },
          { label: "Country", name: "country" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label fw-bold">{field.label}</label>
            <input
              type="text"
              className="form-control"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        ))}

        {isEditing ? (
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
        )}
      </form>
    </div>
  );
}

export default AccountProfilePage;
