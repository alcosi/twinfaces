'use client'

import {Combobox} from "@/components/base/combobox";
import {useContext} from "react";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import {DomainView} from "@/lib/api/api-types";

export function CurrentDomainSelector({className}: {className?: string}) {
    const api = useContext(ApiContext)

    async function getDomains(search: string) {
        try {
            const response = await api.domain.getAll({query: {showDomainMode: 'SHORT'}})
            if (response.error) {
                onGetDomainsError(response.error)
                return []
            }
            return response.data.domainList?.filter((domain) => domain.key!.toLowerCase().includes(search.toLowerCase())) ?? []
        } catch (e) {
            onGetDomainsError(e)
            return []
        }
    }

    function onGetDomainsError(error: any) {
        toast.error('Failed to load domains')
        console.error('Failed to load domains', error)
    }

    function setCurrentDomain(domain?: DomainView) {
        console.log('setting current domain', domain)
        toast.success('Domain changed')
    }

    return <Combobox
        buttonClassName={className}
        getItems={getDomains}
        getItemKey={(domain) => domain.key!}
        getItemLabel={(domain) => domain.key!}
        selectPlaceholder={'Select domain'}
        searchPlaceholder={'Search domain...'}
        noItemsText={'No domains found'}
        onSelect={setCurrentDomain}
        noDeselect
    />
}