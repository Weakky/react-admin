import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    CREATE,
    FETCH_START,
    FETCH_END,
    LongTextInput,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    fetchEnd,
    fetchStart,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import dataProvider from '../dataProvider';
import CancelButton from './PostQuickCreateCancelButton';
import SaveButton from './PostQuickCreateSaveButton';

// We need a custom toolbar to add our custom buttons
// The SaveButton is not the react-admin one because it is dependent on the CRUD actions which we don't use here
// The CancelButton allows to close the modal without submitting anything
const PostQuickCreateToolbar = ({ submitting, onCancel, ...props }) => (
    <Toolbar {...props}>
        <SaveButton saving={submitting} />
        <CancelButton onClick={onCancel} />
    </Toolbar>
);

PostQuickCreateToolbar.propTypes = {
    submitting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
};

class PostQuickCreateView extends Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        fetchEnd: PropTypes.func.isRequired,
        fetchStart: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
    };

    handleSave = values => {
        const { fetchStart, fetchEnd, onSave } = this.props;

        fetchStart();
        dataProvider(CREATE, 'posts', { data: values })
            .then(({ data }) => {
                onSave(data);
            })
            .catch(error => {
                this.setState({ error });
            })
            .finally(() => {
                fetchEnd();
            });
    };

    render() {
        const { submitting, onCancel } = this.props;

        return (
            <SimpleForm
                form="post-create"
                save={this.handleSave}
                redirect={false}
                toolbar={
                    <PostQuickCreateToolbar
                        onCancel={onCancel}
                        submitting={submitting}
                    />
                }
            >
                <TextInput source="title" validate={required()} />
                <LongTextInput source="teaser" validate={required()} />
            </SimpleForm>
        );
    }
}

const mapStateToProps = state => ({
    submitting: state.admin.loading > 0,
});
const mapDispatchToProps = {
    fetchStart,
    fetchEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    PostQuickCreateView
);
