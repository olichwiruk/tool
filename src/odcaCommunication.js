import { EventHandlerConstant, eventBus, exportToZip, createSchemaFromForm } from 'odca-form'
import { get_schemas } from './persistence'
import { SethPhatToaster } from "./config/toaster";
import { generateHashlink } from "./hashlink_generator";

export const initOdcaCommunication = () => {
  eventBus.$on(EventHandlerConstant.ERROR, (error) => {
    SethPhatToaster.error(error);
  })

  eventBus.$on(EventHandlerConstant.EXPORT_FORM, (form) => {
    let schema

    try {
      const baseForm = get_schemas().find(s => s.uuid == form.uuid);
      if (!baseForm) {
          throw "Form cannot be exported"
      }
      schema = createSchemaFromForm(baseForm, form)
    } catch(e) {
      SethPhatToaster.error(e);
    }

    if (schema) {
      exportToZip(schema)
    }
  })

  eventBus.$on(EventHandlerConstant.SAVE_PREVIEW, async (data) => {
    const el = document.createElement('a')
    const dataStr = JSON.stringify(data, null, 2)
    const dataLink = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
    el.setAttribute('href', dataLink)

    const buffer = Buffer.from(dataStr)
    const hashlink = await generateHashlink(buffer)
    el.setAttribute('download', `${hashlink.split(':')[1]}.json`)

    el.click()
    el.remove()
  })
}
