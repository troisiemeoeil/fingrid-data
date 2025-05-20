import { create } from 'zustand';

 const useDialogStore = create((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export default useDialogStore;
