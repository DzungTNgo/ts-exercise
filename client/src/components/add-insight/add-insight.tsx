import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import { useState, type FormEvent, type ChangeEvent } from "react";

type AddInsightProps = ModalProps & {
  reload: boolean
  setReload: (reload: boolean) => void
};

export const AddInsight = (props: AddInsightProps) => {

  const defaultFormData = {
    brand: BRANDS[0].name,
    text: '',
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  }

  const addInsight = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    console.log("Submitting form data:", formData);

    const data = {
      ...formData,
      createdAt: new Date().toISOString(),
    }

    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          console.error("Failed to add insight:", text);
          throw new Error(text || "Failed to add insight");
        });
      }

      props.onClose();
      setFormData(defaultFormData);
      props.setReload(!props.reload);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>

      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select 
            className={styles["field-input"]} 
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          >
            {BRANDS.map(({ id, name }) => <option key={id} value={name}>{name}</option>)}
          </select>
        </label>

        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            name="text"
            placeholder="Something insightful..."
            onChange={handleChange}
          />
        </label>

        <Button 
          className={styles.submit} 
          type="submit" 
          label="Add insight"
        />
      </form>
    </Modal>
  );
};
