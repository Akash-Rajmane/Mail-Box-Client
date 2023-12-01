import { createSlice } from "@reduxjs/toolkit";

const initialSentboxState = {
  sentMails: [],
};

const sentMailsSlice = createSlice({
  name: "sentMails",
  initialState: initialSentboxState,
  reducers: {
    addToSentBox: (state, action) => {
      state.sentMails.push(action.payload);
    },
    
    clearSentBox: (state) => {
      state.sentMails = [];
    },
    
    setCheckedSent: (state, action) => {
      const { id, selector } = action.payload;

      if (selector === "single") {
        const mailItem = state.sentMails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (selector === "all") {
        const checked = state.sentMails.some((item) => item.isChecked === false);
        state.sentMails = state.sentMails.map((mail) => {
          return {
            ...mail,
            isChecked: checked ? true : false,
          };
        });
      } else if (selector === "allMark" || selector === "none") {
        state.sentMails = state.sentMails.map((mail) => {
          return {
            ...mail,
            isChecked: selector === "allMark",
          };
        });
      } else if (selector === "read" || selector === "unread") {
        state.sentMails = state.sentMails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.hasRead === (selector === "read"),
          };
        });
      } else if (selector === "starred" || selector === "unstarred") {
        state.sentMails = state.sentMails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.starred === (selector === "starred"),
          };
        });
      }
    },
    
    moveMailsSent: (state, action) => {
      state.sentMails = state.sentMails.map((mail) => {
        if (mail.isChecked) {
          return {
            ...mail,
            trashed: action.payload === "toTrash",
          };
        }
        return mail;
      });
    },
    
    moveToTrashSent: (state, action) => {
      state.sentMails = state.sentMails.map((mail) => {
        if (mail.id === action.payload) {
          return {
            ...mail,
            trashed: true,
          };
        }
        return mail;
      });
    },
    
    setReadSent: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.sentMails.find((mail) => mail.id === id);
      mailItem.hasRead = true;
    },
    
    toggleStarredSent: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.sentMails.find((mail) => mail.id === id);
      mailItem.starred = !mailItem.starred;
    },
    
    deleteForeverSent: (state, action) => {
      const { id } = action.payload;
      state.sentMails = state.sentMails.filter((mail) => mail.id !== id);
    },
  },
});

export const { addToSentBox, clearSentBox, setReadSent, setCheckedSent, moveToTrashSent, toggleStarredSent, deleteForeverSent, moveMailsSent } = sentMailsSlice.actions;
export default sentMailsSlice.reducer;