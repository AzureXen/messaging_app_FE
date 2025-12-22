"use client";
import React, { useState } from "react";
import Styles from "./create-conversation-modal.module.css";
import { createConversation } from "@/services/conversations";

const CreateConversationModal = ({ open = false, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ conversationName: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose?.();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.conversationName?.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = { groupName: formData.conversationName.trim() };
      const res = await createConversation(payload);
      const apiData = res?.data ?? res;
      if (!apiData) throw new Error("Unexpected response from server");
      const normalized = {
        id: apiData.conversationId ?? apiData.id,
        conversationName: apiData.conversationName,
        group: apiData.group ?? true,
        creatorName: apiData.creatorName,
        lastMessage: null,
      };
      onSuccess?.(normalized);
      setFormData({ conversationName: "" });
      onClose?.();
    } catch (err) {
      console.error("Create group failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create conversation";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={Styles.createConversationModal} onClick={handleBackdropClick}>
      <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h3 className={Styles.title}>Create Group</h3>
          <label className={Styles.label} htmlFor="conversationName">
            Group name
          </label>
          <input
            id="conversationName"
            name="conversationName"
            type="text"
            placeholder="e.g. Project Alpha"
            value={formData.conversationName}
            onChange={handleChange}
            required
            autoComplete="off"
            minLength={3}
            disabled={submitting}
            className={Styles.input}
          />
          {error && <div className={Styles.error}>{error}</div>}
          <div className={Styles.actions}>
            <button type="button" className={Styles.cancelBtn} onClick={() => onClose?.()} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className={Styles.createBtn} disabled={submitting || !formData.conversationName.trim()}>
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConversationModal;
