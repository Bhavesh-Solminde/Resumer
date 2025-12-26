import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalDetails = ({ data, onUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      onUpdate({ ...data, name: value });
    } else {
      onUpdate({
        ...data,
        contact: { ...data.contact, [name]: value },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          name="name"
          value={data.name || ""}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          name="email"
          value={data.contact.email || ""}
          onChange={handleChange}
          placeholder="john@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="phone"
          value={data.contact.phone || ""}
          onChange={handleChange}
          placeholder="+1 234 567 890"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          name="location"
          value={data.contact.location || ""}
          onChange={handleChange}
          placeholder="City, Country"
        />
      </div>
      <div className="space-y-2">
        <Label>LinkedIn</Label>
        <Input
          name="linkedin"
          value={data.contact.linkedin || ""}
          onChange={handleChange}
          placeholder="linkedin.com/in/..."
        />
      </div>
      <div className="space-y-2">
        <Label>GitHub</Label>
        <Input
          name="github"
          value={data.contact.github || ""}
          onChange={handleChange}
          placeholder="github.com/..."
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Portfolio Website</Label>
        <Input
          name="website"
          value={data.contact.website || ""}
          onChange={handleChange}
          placeholder="myportfolio.com"
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
