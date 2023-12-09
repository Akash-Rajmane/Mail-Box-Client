import { createSlice } from "@reduxjs/toolkit";


const initialMailBoxState = {
  mails: [],
  isLoading: false,
};

const mailSlice = createSlice({
  name: "mail",
  initialState: initialMailBoxState,
  reducers: {
    
    addToInbox: (state, action) => {
      if(!state.mails.some(el=>el.id===action.payload.id)){
        state.mails.push(action.payload);
      }
      console.log(state.mails)
    },

    setChecked: (state, action) => {
      const { id, selector } = action.payload;

      if (selector === "single") {
        const mailItem = state.mails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (selector === "all") {
        const checked = state.mails.some((item) => item.isChecked === false);
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: checked ? true : false,
          };
        });
      } else if (selector === "allMark" || selector === "none") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: selector === "allMark",
          };
        });
      } else if (selector === "read" || selector === "unread") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.hasRead === (selector === "read"),
          };
        });
      } else if (selector === "starred" || selector === "unstarred") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.starred === (selector === "starred"),
          };
        });
      }
    },
    
    moveMails: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked) {
          return {
            ...mail,
            trashed: action.payload === "toTrash",
          };
        }
        return mail;
      });
    },
    
    moveToTrash: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.id === action.payload) {
          return {
            ...mail,
            trashed: true,
          };
        }
        return mail;
      });
    },
    
    setRead: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.hasRead = true;
    },
    
    toggleStarred: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.starred = !mailItem.starred;
    },
    
    clearInbox: (state) => {
      state.mails = [];
    },
    
    setMailsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    deleteForever: (state, action) => {
      const { id } = action.payload;
      state.mails = state.mails.filter((mail) => mail.id !== id);
    },

    emptyTrash: (state) => {
      state.mails = state.mails.filter((mail) => mail.trashed === false);
    },
    moveFromSentbox: (state, action) => {
      const { move, email } = action.payload;
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked && mail.sender === email) {
          return {
            ...mail,
            trashed: move === "toTrash",
          };
        }
        return mail;
      });
    },
    moveFromStarred: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked && mail.starred === true) {
          return {
            ...mail,
            trashed: action.payload === "toTrash",
          };
        }
        return mail;
      });
    },
  },
});

export const {
  addToInbox,
  setChecked,
  moveMails,
  setRead,
  clearInbox,
  setMailsLoading,
  moveToTrash,
  toggleStarred,
  deleteForever,
  emptyTrash,
  moveFromSentbox
} = mailSlice.actions;

export default mailSlice.reducer;