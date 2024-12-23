import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ExportDialogProps = {} & Parameters<typeof Dialog>[0];

export function ExportDialog({ onOpenChange, ...props }: ExportDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export video</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="export-width">Width</label>
                <input id="export-width" type="number" className="w-24" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="export-height">Height</label>
                <input id="export-height" type="number" className="w-24" />
              </div>
            </div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="export-fps">FPS</label>
                <input id="export-fps" type="number" className="w-24" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="export-duration">Duration</label>
                <input id="export-duration" type="number" className="w-24" />
              </div>
            </div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="export-codec">Codec</label>
                <input id="export-codec" type="text" className="w-24" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="export-bitrate">Bitrate</label>
                <input id="export-bitrate" type="number" className="w-24" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
