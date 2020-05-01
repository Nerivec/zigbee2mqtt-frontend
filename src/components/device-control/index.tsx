import { Component, ComponentChild, h } from "preact";
import Button from "../button";
import { Device } from "../../types";
import { connect } from "unistore/preact";
import actions, { Actions } from "../../actions";
import { isLeaveReqSend } from "../../binaryUtils";
import cx from "classnames";
interface DeviceControlGroupProps {
    device: Device;
}

export class DeviceControlGroup extends Component<DeviceControlGroupProps & Actions, {}> {
    onBindClick = (): void => {
        const { device } = this.props;
        location.href = `/zigbee/device?dev=${encodeURIComponent(device.nwkAddr)}&activeTab=Bind`;
    };

    onRenameClick = (): void => {
        const { renameDevice, getZigbeeDevicesList, getDeviceInfo, device } = this.props;
        const newName = prompt("Enter new name", device.friendly_name);
        if (newName !== null && newName !== device.friendly_name) {
            renameDevice(device.nwkAddr, newName).then(() => {
                getZigbeeDevicesList(true).then();
                getDeviceInfo(device.nwkAddr);
            });
        }
    };


    onRemoveClick = (): void => {
        const { removeDevice, getZigbeeDevicesList, device  } = this.props;
        const leaveSend = isLeaveReqSend(device.flags) || !device.ieeeAddr;
        const message = leaveSend ? "Remove device?" : "Send leave request?";
        if (confirm(message)) {
            removeDevice(device.nwkAddr, leaveSend).then(() => {
                getZigbeeDevicesList(true).then();
            });
        }
    };

    render(): ComponentChild {
        const {device} = this.props;
        const leaveSend = isLeaveReqSend(device.flags);
        return (
            <div className="btn-group btn-group-sm" role="group">
                <Button<void> className="btn btn-danger" onClick={this.onRemoveClick}><i
                    className={cx("fa", {"fa-trash": leaveSend, "fa-sign-out-alt": !leaveSend})} /></Button>
                <Button<void> className="btn btn-secondary" onClick={this.onRenameClick}><i
                    className="fa fa-edit" /></Button>
                <Button<void> className="btn btn-success" onClick={this.onBindClick}>Bind</Button>
            </div>
        );
    }
}

const mappedProps = [];
const ConnectedDeviceControlGroup = connect<DeviceControlGroupProps, {}, {}, Actions>(mappedProps, actions)(DeviceControlGroup);
export default ConnectedDeviceControlGroup;

